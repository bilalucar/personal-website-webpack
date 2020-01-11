const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

if (process === null) {
    return;
}

const config = {
    user: process.env.ftpUser,
    password: process.env.ftpPassword,
    host: process.env.ftpHost,
    port: 21,
    localRoot: __dirname + '/dist',
    remoteRoot: '/public_html/',
    include: ['*', '**/*'],
    deleteRemote: true,
    forcePasv: true
};

ftpDeploy.deploy(config, function(err, res) {
    if (err) console.log(err);
    else console.log('finished:', res);
});
