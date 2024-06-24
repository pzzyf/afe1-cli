#!/usr/bin/env node
const { Command } = require("commander");
const inquirer = require("inquirer");
const program = new Command();
const path = require("path");
const fs = require("fs");

// 定义当前版本，通过 command 设置 -v 和 --version 参数输出版本号
const package = require("../package.json");
program.option("-v, --version").action(() => {
  console.log(`v${package.version}`);
});

// 通过 inquirer 进行问答，设置 create 命令开始创建模板
program
  .command("create")
  .description("创建模版")
  .action(async () => {
    // 命名项目
    const { projectName } = await inquirer.prompt({
      type: "input",
      name: "projectName",
      message: "请输入项目名称：",
    });
      
    // 读取 templates 目录下的所有子文件夹名字和路径
    const templatesPath = path.join(__dirname, "..", "templates"); // 注意这里的路径计算
    const files = fs.readdirSync(templatesPath, { withFileTypes: true });
    const subDirectories = files.filter((file) => file.isDirectory());
    const folderNames = subDirectories.map((dir) => dir.name);
    const folderPaths = subDirectories.map((dir) =>
      path.join(templatesPath, dir.name)
    );

    // 选择模板
    const { template } = await inquirer.prompt({
      type: "list",
      name: "template",
      message: "请选择模版：",
      choices: folderNames,
    });

    const { promisify } = require("util");
    const copyFile = promisify(fs.copyFile); // 将 fs.copyFile 方法转换为 Promise 形式
    const mkdir = promisify(fs.mkdir); // 将 fs.mkdir 方法转换为 Promise 形式
    async function copyTemplateFiles(templatePath, targetPath) {
      const files = await promisify(fs.readdir)(templatePath);
      for (const file of files) {
        const sourceFilePath = path.join(templatePath, file);
        const targetFilePath = path.join(targetPath, file);
        const stats = await promisify(fs.stat)(sourceFilePath);
        if (stats.isDirectory()) {
          await mkdir(targetFilePath);
          await copyTemplateFiles(sourceFilePath, targetFilePath);
        } else {
          await copyFile(sourceFilePath, targetFilePath);
        }
      }
    }

    // 当全部内容选择完时，创建项目文件夹并复制模板文件到当前目录
    const targetPath = path.join(process.cwd(), projectName);
    await mkdir(targetPath);
    const selectedTemplateIndex = folderNames.indexOf(template);
    const selectedTemplatePath = folderPaths[selectedTemplateIndex];
    await copyTemplateFiles(selectedTemplatePath, targetPath);
    console.log("模板复制完成！");
  });

// 解析用户执行命令传入参数
program.parse(process.argv);
