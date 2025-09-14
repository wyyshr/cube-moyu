const tools = document.querySelector('.tools')
const items = ['文件','开始','插入','绘图','设计','布局','引用','邮件','审阅','视图','帮助']
for (const text of items) {
    const item = document.createElement('div')
    item.innerHTML = text
    if (text == '开始') {
        item.className = 'tools_item selected'
    } else {
        item.className = 'tools_item'
    }
    tools.appendChild(item)
}