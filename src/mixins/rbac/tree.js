import {Message, Loading, MessageBox} from "element-ui";

/** 导入 rbac - tree 专用的 接口 */
import tree from '../../api/rbac/menuTree'
// 角色权限 mixins
export const TreeMixins = {
    data() {
        return {
            filterText: '',
            data: [{
                id:0,
                label:'根目录',
                noRole:true,
                children:[]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            treeData:{},
            openPopupData:{
                status:false,
                title:'',
                type:''
            }
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        /**
         * 目录 1
         * 菜单 2
         * 按钮 3
         * 按钮菜单 4
         * */
        nodeShowOrHide(data,type){
            // 是否是增加目录
            if(type == 'directory'){
                return data.noRole;
            }
            if(type == 'menu'){
                return data.type == 1 || data.type == 2
            }
            if(type == 'button'){
                return data.type == 1 || data.type == 2 || data.type == 3 || data.type == 4
            }
            if(type == 'element'){}
            if(type == 'becomeButton'){
                return data.type == 2
            }
            if(type == 'becomeMenu'){
                return data.type == 4
            }
            if(type == 'becomeMenuButton'){
                return data.type == 3
            }
            return false
        },
        updateTreeNode(item,state){
            if(state<-1){
                item.state = state;
            }else {
                item.type = state;
            }
            tree.addRbac(item).then(res=>{
                if(!res.code) {
                    Message.success('更新成功');
                    this.getTree(2);
                    // 同步左侧菜单内容
                    this.updateLeftTree();
                }
            })
        },
        updateLeftTree(){
            this.$parent.$parent.$parent.$refs.leftMenu.getMenu('update')
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        append(data,type) {
            // rbac 整理修改为 个别类型的按钮
            switch (type) {
                case 'button' :

                    break;
                case 'element' :

                    break;
            }
            this.openPopup({
                status:true,
                title:`在 ${data.name?data.name:'根目录'} 下新增数据`,
                type});
            // 在新增的时候判断一下有没有 pid 有就传没有传输
            // 在当前 id 下新增节点
            if(data.id){
                this.treeData = {pid:data.id};
            }else {
                this.treeData = {};
            }
            return false;
        },
        update(data) {
            console.log(data);
            // 打开 树数据模板
            this.openPopup({
                status:true,
                title:`修改 ${data.name} 数据`,
                type:data.type});
            this.treeData = data;
            return false;
        },
        getTreeData(operating,callback){
            // 如果传来的是 close 那么关闭弹窗
            if(operating == 'close'){
                callback('clear');
                this.openPopup(false)
            }else {
                tree.addRbac(operating).then(res=>{
                    if(!res){
                        callback('stop');
                    }else{
                        console.log(res);
                        Message({
                            message: res.message,
                            type: 'success'
                        });
                        callback('clear');
                        this.openPopup(false);
                        this.getTree(2);
                        // 同步左侧菜单内容
                        this.updateLeftTree();
                    }
                })
            }
        },
        openPopup(config){
            if(!config){
                // 如果 树数据模板 消失后 模板数据清空
                this.treeData = {};
            }
            this.openPopupData.status = config.status;
            this.openPopupData.type = config.type;
            this.openPopupData.title = config.title;
        },
        filterTree(data){
            this.data[0].children = this.data1 = data.filter(treeNode=>{
                treeNode.label = treeNode.name;
                if(treeNode.children){
                    this.filterTree(treeNode.children);
                }
                return true
            })
        },
        treeModelClose(done){
            MessageBox('确定关闭？')
                .then(res => {
                    done();
                })
                .catch(e => {});
        },
        isCheck(data, checked, indeterminate){
            // checked 来判断当前点击的节点是否被选中
            if(checked){
                // 选中将 当前的节点新增
                this.checkNode.push(data.id)
            }else {
                // 否则删除
                this.checkNode.remove(data.id);
            }
        },
        async getTree(type){
            tree.getRbac(type).then(res=>{
                this.filterTree(res.data);
                // 通过这里来读取用户可以支配的权限，以及用户已经被支配的权限
            })
        }
    },
    mounted() {
        this.getTree(2)
    }
};
