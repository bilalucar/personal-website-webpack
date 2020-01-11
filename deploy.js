const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

if (process === null) {
    return;
}

console.log(process.env);
console.log(process.env.FTP_HOST);
console.log(process.env.FTP_USER);
console.log(process.env.FTP_PASSWORD);

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

ftpDeploy.deploy(config, function(err, res) {
    if (err) console.log(err);
    else console.log('finished:', res);
});
