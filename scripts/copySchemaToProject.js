import fs from 'fs-extra-promise'; // eslint-disable-line import/no-extraneous-dependencies

const copySchemaToProject = async () => {
  try {
    await fs.copy('./data', '../ReactNavigationRelayModern/data');

    console.info('Schema successfully copied to ReactNavigationRelayModern');
  } catch (error) {
    console.error(
      'You can setup scripts/copySchemaToProject to automatically copy the schema to other projects that should be kept in sync',
      error,
    );
  }
};

copySchemaToProject();
