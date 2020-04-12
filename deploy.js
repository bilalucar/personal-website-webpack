const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

console.log('process.env.DENEME_ENV', process.env.DENEME_ENV);

const config = {
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: __dirname + '/dist',
    remoteRoot: '/public_html/',
    include: ['*', '**/*'],
    deleteRemote: true,
    forcePasv: true
};

ftpDeploy.deploy(config, function (err, res) {
    console.log('Test');
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
