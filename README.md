# rbac 单独模块管理
```
    使用 技术栈内容 后台系统
    vuecli(4.3.0) + element-ui(pug+html) + javascript 
```
# aliOss 使用 postObject 方式
```
    首先 导入 mixin 下的 ossUpload 文件
    通过 js 角度上传图片 this.ossUploadMixins('file','type')
    参数讲解 : file -> 上传的 img 图片对象
              type -> 增加的参数的类型的内容 共两种 -> img video (暂时没有增加)
    通过 el-upload 角度上传图片 
        file(视频) -> ossUploadBeforeAvatarUploadVideoMixins
        file(图片) -> ossUploadBeforeAvatarUploadMixins
```
