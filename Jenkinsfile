library identifier: 'jenkins-pipeline-libraries@kubernetes-node', retriever: modernSCM(
  [$class: 'GitSCMSource',
   remote: 'http://git.ambow.com/operation/jenkins-pipeline-libraries',
   credentialsId: 'AmbowGitlab-GaoPeng'])


def config = [:]
// Kubernetes 服务名，不能超过 15 个字符，不同分支需修改服务名进行区分
config.put('SERVICE_NAME', 'saas-web')
// 服务端口号
config.put('SERVICE_PORT', '80')
// 镜像仓库，在 Harbor 中表示为「项目名称」
config.put('IMAGE_REPO', 'harbor.ambow.com/ambow-sc')
// Kubernetes 命名空间
config.put('NAMESPACE', 'base-service')
// Kubernetes Pod 最大内存限制，单位 MiB
config.put('MAX_MEM', '512')
// Kubernetes Pod 最小内存资源请求
config.put('MIN_MEM', '128')
// Kubernetes Pod 最大 CPU 限制，单位 m，1000m 等于 1 核
config.put('MAX_CPU', '1000')
// Kubernetes Pod 最小 CPU 资源请求
config.put('MIN_CPU', '100')
// 电子邮件，构建失败会发送邮件通知
config.put('MAIL', 'jiaoyang.cheng@ambow.com')
// 项目构建命令
//config.put('BUILD_CMD', '')

// 传参运行构建函数
build(config)
