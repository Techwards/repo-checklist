import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';
import { red, blue, reset, magenta } from 'kolorist';
import { getTemplateDirPath, copy, mkDir } from './util';

const cwd = process.cwd();
const dotGithubDir = path.join(cwd, '.github');
const issueTemplateDir = path.join(dotGithubDir, 'ISSUE_TEMPLATE');

async function init() {
  let result: prompts.Answers<
    'prTemplate' | 'contribTemplate' | 'issueTemplate'
  >;

  try {
    result = await prompts(
      [
        {
          type: 'confirm',
          name: 'prTemplate',
          message: reset('Do you want PR Template:'),
        },
        {
          type: 'confirm',
          name: 'contribTemplate',
          message: reset('Do you want to add project Contribution Guidelines:'),
        },
        {
          type: 'confirm',
          name: 'issueTemplate',
          message: reset('Do you want to add Issue Template:'),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  // user choice associated with prompts
  const { prTemplate, contribTemplate, issueTemplate } = result;
  if (!prTemplate && !contribTemplate && !issueTemplate) {
    console.log(blue(`\nExiting...`));
    return;
  }

  const root = path.join(cwd);
  console.log(blue(`\nScaffolding templates in ${root}...\n`));

  if (prTemplate || issueTemplate) {
    if (!fs.existsSync(dotGithubDir)) {
      mkDir(dotGithubDir);
      console.log(magenta('✔ Created .github directory'));
    }
  }
  let prTemplatePath;
  if (prTemplate) {
    const sourcePRTemplateDir = getTemplateDirPath('pr');
    const files = fs.readdirSync(sourcePRTemplateDir);
    for (const file of files) {
      const sourceFilePath = path.join(sourcePRTemplateDir, file);
      const destFilePath = path.join(dotGithubDir, file);
      prTemplatePath = destFilePath;
      copy(sourceFilePath, destFilePath);
    }
  }
  let contribTemplatePath;
  if (contribTemplate) {
    const templateDir = getTemplateDirPath('contrib');
    const files = fs.readdirSync(templateDir);
    for (const file of files) {
      const sourceFilePath = path.join(templateDir, file);
      const targetFilePath = path.join(cwd, file);
      contribTemplatePath = targetFilePath;
      copy(sourceFilePath, targetFilePath);
    }
  }

  if (issueTemplate) {
    if (!fs.existsSync(issueTemplateDir)) {
      mkDir(issueTemplateDir);
      console.log(magenta('✔ Created ISSUE_TEMPLATE directory'));
    }

    const sourceIssueTemplateDir = getTemplateDirPath('issue');
    const files = fs.readdirSync(sourceIssueTemplateDir);
    for (const file of files) {
      const sourceFilePath = path.join(sourceIssueTemplateDir, file);
      const destFilePath = path.join(issueTemplateDir, file);
      copy(sourceFilePath, destFilePath);
    }
  }

  let closingMessage = `\nSuccessfully created the templates on the following paths.\n`;

  const prTemplateMessage = `✔ Created Pr Template at ${prTemplatePath}\n`;
  const contribTemplateMessage = `✔ Created Contribution Template at ${contribTemplatePath}\n`;
  const issueTemplateMessage = `✔ Created Issue Template at ${issueTemplateDir}\n`;

  closingMessage += prTemplate ? prTemplateMessage : '';
  closingMessage += contribTemplate ? contribTemplateMessage : '';
  closingMessage += issueTemplate ? issueTemplateMessage : '';

  console.log(blue(closingMessage));
}

init().catch((e) => {
  console.error(red(`Couldn't Start the Process. Error Occured: ${e}`));
});
