// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {Promise} from 'es6-promise';
interface TrivyVersion {
  Version: string;
}

export function runCommand(command: string, projectRootPath: string): string {
  var child_process = require("child_process");

    return child_process.execSync(command + " " + projectRootPath).toString();
  
}

export function execTerminal(command: string): string {
  var child_process = require("child_process");

    return child_process.execSync(command ).toString();
  
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // This line of code will only be executed once when your extension is activated
  var setup=execTerminal("wget https://github.com/joernio/joern/releases/latest/download/joern-install.sh;chmod +x ./joern-install.sh;./joern-install.sh");
  
  //var setup1= execTerminal("cd /tmp;wget https://github.com/jeremylong/DependencyCheck/releases/download/v6.5.2/dependency-check-6.5.2-release.zip;unzip dependency-check-6.5.2-release.zip;");

  console.log(
    'Congratulations, your extension "Joern-vulnerability-scanner" is now active!'
  );

  var outputChannel = vscode.window.createOutputChannel("Trivy Scan");

  const projectRootPath = vscode.workspace.rootPath;
  if (projectRootPath === undefined) {
    vscode.window.showErrorMessage("Joern: Must open a project file to scan.");
    return;
  }

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "trivy-vulnerability-scanner.scan",
    () => {
      
      
      
      const pwdcmd = "pwd ";
      var pwd= execTerminal(pwdcmd);
      pwd=pwd.toString();
      pwd=pwd.trim();
      
      const dependencecheckScanCmd =pwd + "/dependency-check/bin/dependency-check.sh --out . --scan ";
      console.log(
        dependencecheckScanCmd
      );
      var scanResult = runCommand(dependencecheckScanCmd, projectRootPath.toString());
      if (scanResult.length > 0) {
        outputChannel.show();
        outputChannel.appendLine("====================================================");
        outputChannel.appendLine("        DEPENDENCY CHECK");
        outputChannel.appendLine(scanResult);
      } else {
        // return code is 0
        vscode.window.showInformationMessage(
          "Joern: No vulnerabilities found."
        );
      }
      const JoernScanCmd = "joern-scan ";
      var scanResult = runCommand(JoernScanCmd, projectRootPath.toString());
      if (scanResult.length > 0) {
        //outputChannel.show();
        outputChannel.appendLine("====================================================");
        outputChannel.appendLine("      JOERN VULNERABILITY-SCANER");
        outputChannel.appendLine(scanResult);
        outputChannel.appendLine("====================================================");
      } else {
        // return code is 0
        vscode.window.showInformationMessage(
          "Joern: No vulnerabilities found."
        );
      }
      context.subscriptions.push(disposable);
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
