const inquirer = require('inquirer');
const handlebars = require('handlebars');
const fs = require('fs');

handlebars.registerHelper('list', function(items, options) {
  let out = '';
  for(var i=0, l=items.length; i<l; i++) {
    out += options.fn(items[i])
  }

  return out;
});

function doAddServiceApi(opts) {
  if (opts.addServerApi === 'y' || opts.addServerApi === 'Y') {
    inquirer.prompt([
      {
        name: 'prefix',
        message: 'Which prefix do you want(EX. https://xxx.xxx.xxx.xxx:port/{prefix}/{path})?'
      },
      {
        name: 'host',
        message: 'Server address like https://xxx.xxx.xxx.xxx:port/{prefix}?'
      },
      {
        name: 'shouldCross',
        message: 'Want to add Cross info in headers like Access-Controll-Allow-XXX(Default: N)(Y or N)?'
      },
      {
        name: 'addServerApi',
        message: `Do you want to add ${opts.proxy.length > 0 ?'another ':''}proxy of service api(Y or N)?`
      }
    ]).then((answers) => {
      opts.proxy.push({
        prefix: answers.prefix,
        host: answers.host,
        shouldCross: (answers.shouldCross === 'Y' || answers.shouldCross === 'y') && 'Y' || ''
      })
      opts.addServerApi = answers.addServerApi;
      doAddServiceApi(opts);
    })
  } else {
    const temp = fs.readFileSync('./templates/nginx.temp').toString('UTF8');
    const result = handlebars.compile(temp)(opts);
    fs.writeFileSync(`${process.cwd()}/${opts.name}.conf`, result);

    console.log(`Please copy ${process.cwd()}/${opts.name}.conf into nginx/conf.d (EX. /etc/nginx/conf.d/).`)
  }
}

module.exports = function (opts) {
  inquirer.prompt([
    {
      name: 'port',
      message: 'The port you should to use for your Web service(Default: 80):',
      default: 80
    },
    {
      name: 'serverName',
      message: 'The Server Name for your Web service(Default: localhost):',
      default: 'localhost'
    },
    {
      name: 'distPath',
      message: 'Input the path where are your frontend files(html,css,js,others...):',
      validate: function (val) {
        const done = this.async();
        if (val === '') {
          done('Please input the path for your frontend files like html.css,js');
          return false;
        } else {
          done(null, true);
          return true;
        }
      }
    },
    {
      name: 'cacheExpires',
      message: 'Set the expires of cache for JS, CSS and others(Default: 7d):',
      default: '7d'
    },
    {
      name: 'addServerApi',
      message: 'Do you want to add proxy of service api(Y or N)?'
    }
  ]).then((answers) => {
    answers.proxy = [];
    answers.cacheExpires = answers.cacheExpires === '' ? '7d' : answers.cacheExpires;
    doAddServiceApi({...answers, ...opts});
  });
}