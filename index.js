let fs = require('fs');
let _ = require('lodash');

let psgc = require('./psgc.json');

function extract(what) {
    let data;

    if(what == 'citymun') {
        let extract = psgc.filter( el => el['Inter-Level'] == 'City' || el['Inter-Level'] == 'Mun' || el['Inter-Level'] == 'SubMun');

        data = extract;
    } else if (what == 'prov') {
        let extract = psgc.filter( el => el['Inter-Level'] == 'Dist' || el['Inter-Level'] == 'Prov');

        data = extract;
    } else {
        let extract = psgc.filter( el => el['Inter-Level'] == what );

        if(what == 'Bgy') {
            let newExtract = [];
            extract.forEach(element => {
                let bgyCode = element.Code;
                if(bgyCode != undefined || bgyCode != null) {
                    let codeSearch = String(bgyCode).substr(0, 6);

                    const regex = new RegExp('^' + codeSearch, 'g');
                    let citymun = psgc.find(el => String(el['Code']).match(regex));

                    newExtract.push({
                        code: element.Code,
                        name: element.Name,
                        citymun: _.startCase(_.toLower(citymun.Name))
                    });
                }
                
            });

            extract = newExtract;

            data = JSON.stringify(extract);

            fs.writeFile(what + '-citymun.json', data, (error) => {
                console.log(error)
            });

            return 1;
        }

        data = extract;
    }

    data = data.map(
        el => {
            return (
                {
                    code: el.Code,
                    name: _.startCase(_.toLower(el.Name)),
                    type: el['Inter-Level']
                }
            );
        }
    )

    data = JSON.stringify(data);

    fs.writeFile(what + '.json', data, (error) => {
        console.log('Error encountered?', error)
    });

    return 1;
}

function run() {
    let args = process.argv;

    if(args.includes('reg')) extract('Reg');
    if(args.includes('prov')) extract('Prov');
    if(args.includes('mun')) extract('citymun');
    if(args.includes('bgy')) extract('Bgy');
}

run();