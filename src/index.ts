import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';
import { red, reset } from 'kolorist';
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
          message: reset('Do you want Pr Template:'),
        },
        {
          type: 'confirm',
          name: 'contribTemplate',
          message: reset('Do you want Contrib Template:'),
        },
        {
          type: 'confirm',
          name: 'issueTemplate',
          message: reset('Do you want issue Template:'),
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
    console.log(`\nExiting...`);
    return;
  }

  const root = path.join(cwd);
  console.log(`\nScaffolding templates in ${root}...`);

  if (contribTemplate) {
    const templateDir = getTemplateDirPath('contrib');
    const files = fs.readdirSync(templateDir);
    for (const file of files) {
      const sourceFilePath = path.join(templateDir, file);
      const targetFilePath = path.join(cwd, file);
      copy(sourceFilePath, targetFilePath);
    }
  }

  if (prTemplate) {
    if (!fs.existsSync(dotGithubDir)) {
      console.log('.github dir does not exist, making .github dir');
      mkDir(dotGithubDir);
      console.log('.github dir created');
    }
    const sourcePRTemplateDir = getTemplateDirPath('pr');
    const files = fs.readdirSync(sourcePRTemplateDir);
    for (const file of files) {
      const sourceFilePath = path.join(sourcePRTemplateDir, file);
      const destFilePath = path.join(dotGithubDir, file);
      copy(sourceFilePath, destFilePath);
    }
  }

  if (issueTemplate) {
    if (!fs.existsSync(dotGithubDir)) {
      console.log('.github dir does not exist, making .github dir');
      mkDir(dotGithubDir);
      console.log('.github dir created');

      if (!fs.existsSync(issueTemplateDir)) {
        console.log(
          'issueTemplate dir does not exist, making issueTemplate dir',
        );
        mkDir(issueTemplateDir);
        console.log('issueTemplate dir created');
      }
    } else {
      if (!fs.existsSync(issueTemplateDir)) {
        console.log(
          'issueTemplate dir does not exist, making issueTemplate dir',
        );
        mkDir(issueTemplateDir);
        console.log('issueTemplate dir created');
      }
    }

    const sourceIssueTemplateDir = getTemplateDirPath('issue');
    const files = fs.readdirSync(sourceIssueTemplateDir);
    for (const file of files) {
      const sourceFilePath = path.join(sourceIssueTemplateDir, file);
      const destFilePath = path.join(issueTemplateDir, file);
      copy(sourceFilePath, destFilePath);
    }
  }

  console.log();
}

init().catch((e) => {
  console.error(e);
});
