import { ossConfig } from '../config/project.config';
// 导入提示层
import { Message } from 'element-ui';
// 导入请求层
import $request from "../api/request"
const getOssSignApi = (params) => {
  return $request.get(`/storage/api/v1/auth/ALIYUN/zncgfjwfjqwfjwqlfebopo/zncgfjwfjqwfjwqlfebopo`, params);
}
const base64 = require('../utils/base64');// Base64,hmac,sha1,crypto相关算法
require('../utils/hmac.js');
require('../utils/sha1.js');
const Crypto = require('../utils/crypto.js');


export const OssUploadMixins = {
  components: {
    Message,
  },
  data() {
    return {
      ossUploadLoadingMixins: false,
      ossUploadActionMixins: 'words/images/pic/m/',
      ossUploadActionVideoMixins: 'words/voice/m/',
      ossUploadTypeMixins: 'file',
      ossUploadUrlMixins: '',
      ossUploadNameMixins: 'file',
      ossUploadFormDataMixins: {},
      ossUploadFileListMixins: [],
      ossUploadAliyunFileKeyMixins: '',
      ossUploadLimitMinxins: 10,
    };
  },
  methods: {
    async ossUploadGetOssSignMinxins(file) {
      return new Promise(async (resolve, reject) => {
        await getOssSignApi({}).then((res) => {
          if (this.ossUploadTypeMixins === 'video') {
            this.uploadImg(this.ossUploadActionVideoMixins, res.data, file);
          } else {
            this.uploadImg(this.ossUploadActionMixins, res.data, file);
          }
          resolve(true);
        }).catch((e) => {
          console.log(e);
          reject(new Error(e));
        });
      });
    },
    async ossUploadBeforeAvatarUploadVideoMixins(file) {
      this.ossUploadTypeMixins = 'video';
      return await this.ossUploadGetOssSignMinxins(file);
    },
    async ossUploadBeforeAvatarUploadMixins(file) {
      this.ossUploadTypeMixins = 'file';
      return await this.ossUploadGetOssSignMinxins(file);
    },
    uploadImg(dir, ossInfo, file) {
      // 图片名字 可以自行定义，     这里是采用当前的时间戳 + 150内的随机数来给图片命名的
      const extName = file.name.split('.').pop().toLowerCase();
      const aliyunFileKey = `${dir + new Date().getTime() + Math.floor(Math.random() * 150)}.${extName}`;
      this.ossUploadAliyunFileKeyMixins = aliyunFileKey;
      const aliyunServerURL = ossInfo.urlPrefix;// OSS地址，需要https
      const accessid = ossInfo.accessKeyId;
      const policyBase64 = this.getPolicyBase64();
      const signature = this.getSignature(policyBase64, ossInfo.accessKeySecret);// 获取签名
      this.ossUploadUrlMixins = aliyunServerURL;
      this.ossUploadFormDataMixins = {
        key: aliyunFileKey,
        policy: policyBase64,
        OSSAccessKeyId: accessid,
        success_action_status: '200',
        'x-oss-security-token': ossInfo.securityToken,
        signature,
      };
    },
    ossUploadMixins(file) {
      return new Promise((resolve, reject) => {
        this.ossUploadTypeMixins = 'file';
        getOssSignApi({}).then(async (res) => {
          this.uploadImg(this.ossUploadActionMixins, res.data, file);
          const result = await this.ossUpload(file);
          resolve(result);
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
      });
    },
    ossUpload(file) {
      return new Promise((resolve, reject) => {
        const {
          key, policy, OSSAccessKeyId, signature,
        } = this.ossUploadFormDataMixins;
        const formData = new FormData();
        formData.append('key', key);
        formData.append('OSSAccessKeyId', OSSAccessKeyId);
        formData.append('policy', policy);
        formData.append('signature', signature);
        formData.append('success_action_status', '200');
        formData.append('x-oss-security-token', this.ossUploadFormDataMixins['x-oss-security-token']);
        formData.append('file', file);
        $request.post(this.ossUploadUrlMixins, formData).then((res) => {
          // const { status } = res;
          // if (status === 200) {
            const data = {
              url: `${this.ossUploadUrlMixins}/${this.ossUploadAliyunFileKeyMixins}`,
              type: file.name ? file.name : '',
            };
            resolve(data);
          // } else {
          //   reject(res);
          // }
        }).catch((err) => {
          reject(err);
        });
      });
    },
    uploadSuccessMixins(response, file, fileList) {
      this.ossUploadFileListMixins.push(`${this.ossUploadUrlMixins}/${this.ossUploadAliyunFileKeyMixins}`);
    },
    getPolicyBase64() {
      const date = new Date();
      date.setHours(date.getHours() + ossConfig.timeout);
      const srcT = date.toISOString();
      const policyText = {
        expiration: srcT, // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        conditions: [
          ['content-length-range', 0, 5 * 1024 * 1024], // 设置上传文件的大小限制,5mb
        ],
      };

      const policyBase64 = base64.encode(JSON.stringify(policyText));
      return policyBase64;
    },
    getSignature(policyBase64, accessKeySecret) {
      const accesskey = accessKeySecret;
      const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true,
      });
      const signature = Crypto.util.bytesToBase64(bytes);
      return signature;
    },
  },
};



// 测试请求 用例
// console.log(OssUploadMixins.methods.ossUploadGetOssSignMinxins({name: '111'}));
