const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = {
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: __dirname + '/dist',
    remoteRoot: process.env.FTP_PATH,
    include: ['*', '**/*'],
    deleteRemote: true,
    forcePasv: true
};

ftpDeploy.deploy(config, function (err, res) {
    if (err) console.log(err);
});

ftpDeploy.on("uploading", function(data) {
    console.log('Total:', data.totalFilesCount);
    console.log('Transferred', data.transferredFileCount);
    console.log('Current File', data.filename);
    console.log('----------------------------------------');
});

ftpDeploy.on("upload-error", function(data) {
    console.log(data.err);
});
