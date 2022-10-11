const common = require('../Common/query')
const query = common.query
const fs = require("fs");
const ws = fs.createWriteStream("dataExcel.csv");
const xl = require('excel4node');

module.exports.ExportExcel = async (req, res) => {

    var wb = new xl.Workbook();

    var ws1 = wb.addWorksheet('ApiSource');
    var ws2 = wb.addWorksheet('Metter');
    var ws3 = wb.addWorksheet('Tag');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',
            size: 13,
        },
    });

    var HeaderStyle = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
            name: 'Arial',
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    //Header---------------------
    let header_row = 1

    ws1.cell(header_row, 1).string('Id').style(HeaderStyle);
    ws1.cell(header_row, 2).string('Connection_name').style(HeaderStyle)
    ws1.cell(header_row, 3).string('Description').style(HeaderStyle)
    ws1.cell(header_row, 4).string('Connection_time').style(HeaderStyle)
    ws1.cell(header_row, 5).string('Interval').style(HeaderStyle)
    ws1.cell(header_row, 6).string('Status').style(HeaderStyle)
    ws1.cell(header_row, 7).string('Time_offset').style(HeaderStyle)
    ws1.cell(header_row, 8).string('Is_authorization').style(HeaderStyle)
    ws1.cell(header_row, 9).string('Username').style(HeaderStyle)
    ws1.cell(header_row, 10).string('Password').style(HeaderStyle)
    ws1.cell(header_row, 11).string('Key_time').style(HeaderStyle)

    ws1.column(2).setWidth(25)
    ws1.column(3).setWidth(25)

    ws2.cell(header_row, 1).string('Id').style(HeaderStyle);
    ws2.cell(header_row, 2).string('Api_source').style(HeaderStyle)
    ws2.cell(header_row, 3).string('Metter_id').style(HeaderStyle)
    ws2.cell(header_row, 4).string('Serial').style(HeaderStyle)
    ws2.cell(header_row, 5).string('Description').style(HeaderStyle)
    ws2.cell(header_row, 6).string('Interval').style(HeaderStyle)
    ws2.cell(header_row, 7).string('Status').style(HeaderStyle)
    
    ws2.column(3).setWidth(25)
    ws2.column(5).setWidth(25)

    ws3.cell(header_row, 1).string('Id').style(HeaderStyle);
    ws3.cell(header_row, 2).string('Api_source').style(HeaderStyle)
    ws3.cell(header_row, 3).string('Metter_id').style(HeaderStyle)
    ws3.cell(header_row, 4).string('Name').style(HeaderStyle)
    ws3.cell(header_row, 5).string('Parameter').style(HeaderStyle)
    ws3.cell(header_row, 6).string('Data_type').style(HeaderStyle)
    ws3.cell(header_row, 7).string('Scale').style(HeaderStyle)
    ws3.cell(header_row, 8).string('Note').style(HeaderStyle)
    
    
    ws3.column(3).setWidth(25)
    ws3.column(5).setWidth(25)

    // Query Database
    // API Source Table
    let apiSourceTable = await query("SELECT * FROM ApiSource")
    for (let i = 0; i < apiSourceTable.length; i++) {
        ws1.cell(i + 2, 1).number(apiSourceTable[i].id)
        ws1.cell(i + 2, 2).string(apiSourceTable[i].connection_name).style({
            alignment: {
                wrapText: true,
                horizontal: 'left',
            }
        })
        ws1.cell(i + 2, 3).string(apiSourceTable[i].description).style({
            alignment: {
                wrapText: true,
                horizontal: 'left',
            }
        })
        ws1.cell(i + 2, 4).number(apiSourceTable[i].connection_time)
        ws1.cell(i + 2, 5).number(apiSourceTable[i].interval)
        ws1.cell(i + 2, 6).number(apiSourceTable[i].status)
        ws1.cell(i + 2, 7).number(apiSourceTable[i].time_offset)
        ws1.cell(i + 2, 8).number(apiSourceTable[i].is_authorization)
        ws1.cell(i + 2, 9).string(apiSourceTable[i].username)
        ws1.cell(i + 2, 10).string(apiSourceTable[i].password)
        ws1.cell(i + 2, 11).string(apiSourceTable[i].key_time)
    }

    // Metter Table
    let metterTable = await query("SELECT * FROM Metter")
    for (let i = 0; i < metterTable.length; i++) {
        ws2.cell(i + 2, 1).number(metterTable[i].id)
        ws2.cell(i + 2, 2).number(metterTable[i].api_source)
        ws2.cell(i + 2, 3).string(metterTable[i].metter_id)
        ws2.cell(i + 2, 4).number(metterTable[i].serial)
        ws2.cell(i + 2, 5).string(metterTable[i].description)
        ws2.cell(i + 2, 6).number(metterTable[i].interval)
        ws2.cell(i + 2, 7).number(metterTable[i].status)
    }

    // Metter Tag
    let tagTable = await query("SELECT * FROM tag")
    for (let i = 0; i < tagTable.length; i++) {
        ws3.cell(i + 2, 1).number(tagTable[i].id)
        ws3.cell(i + 2, 2).number(tagTable[i].api_source)
        ws3.cell(i + 2, 3).string(tagTable[i].metter_id)
        ws3.cell(i + 2, 4).string(tagTable[i].name)
        ws3.cell(i + 2, 5).string(tagTable[i].parameter)
        ws3.cell(i + 2, 6).string(tagTable[i].data_type)
        ws3.cell(i + 2, 7).number(tagTable[i].scale)
        ws3.cell(i + 2, 8).string(tagTable[i].note)
    }

    let file_name = 'API_HUB_CONFIG' + '.xlsx'
    wb.write('./Exports/' + file_name, res);
}