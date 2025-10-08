const { exec } = require('child_process');

function checkDocker() {
  return new Promise((resolve) => {
    exec('docker --version', (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function checkDockerCompose() {
  return new Promise((resolve) => {
    exec('docker-compose --version', (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

async function main() {
  console.log('Checking Docker installation...');
  
  const dockerInstalled = await checkDocker();
  const dockerComposeInstalled = await checkDockerCompose();
  
  if (dockerInstalled) {
    console.log('✅ Docker is installed');
  } else {
    console.log('❌ Docker is not installed');
    console.log('Please install Docker Desktop from https://www.docker.com/products/docker-desktop');
  }
  
  if (dockerComposeInstalled) {
    console.log('✅ Docker Compose is installed');
  } else {
    console.log('❌ Docker Compose is not installed');
    console.log('Docker Compose is included with Docker Desktop. Please install Docker Desktop.');
  }
  
  if (dockerInstalled && dockerComposeInstalled) {
    console.log('\n🎉 You\'re ready to start MySQL!');
    console.log('Run the following commands to start the database:');
    console.log('  cd d:\\internmacth');
    console.log('  docker-compose up -d');
  } else {
    console.log('\nPlease install Docker Desktop and try again.');
  }
}

if (require.main === module) {
  main();
}