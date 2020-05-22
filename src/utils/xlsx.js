import FileSaver from 'file-saver';
import XLSX from 'xlsx';

/*
* 使用：  @click.native.prevent="exportExcel('table-data','会员管理')"
* el-table 添加属性 id="table-data"  XLSX.uitls.table_to_book
* exportExcel(id:string, title:string):void { // 导出表格 传入两个参绑定的id和表格名称
    excel(id, title);
  }
*/

export const excel = (id, title) => {
  let fix = document.querySelector('.el-table__fixed');
  const fixRight = document.querySelector('.el-table__fixed-right');
  let wb;
  if (fix || fixRight) {
    fix = fix || fixRight;
    wb = XLSX.utils.table_to_book(document.querySelector(`#${id}`).removeChild(fix));
    document.querySelector(`#${id}`).appendChild(fix);
  } else {
    wb = XLSX.utils.table_to_book(document.querySelector(`#${id}`));
  }

  /* get binary string as output */
  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
  try {
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${title}.xlsx`);
  } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout); }
  return wbout;
};
