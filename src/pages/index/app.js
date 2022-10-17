import '@/styles/index.less'
import './style.less'
import $ from 'jquery'

const host = 'https://szjj.dsj.taiyuan.gov.cn:7777'
const app = {
    loadData() {
        $.ajax({
            type: 'POST',
            url: host + '/tmp_url/enterprise_show/get_enterprise',
            contentType: 'application/json', // 必须有
            data: JSON.stringify({
                id: app.getSearchParams().PID
            }),
            async: false,
            success: (rs) => {
                if (rs.status === 0) {
                    if (rs.reviewed==='审核通过'){
                        app.render(rs.data)
                    }else {
                        layer.msg('企业信息审核中，暂时无法查看!')
                        setTimeout(()=>{
                            window.location.href='compny.html'
                        },500)
                    }
                } else {
                    alert('企业信息获取失败')
                }
            }
        })
    },
    render(rs) {
        // 锚点
        $('.tab-wrapper a').on('click',function () {
            $(this).addClass('active').siblings().removeClass('active')
        })
        const {name, introduction, culture, renovation, honors, productions, photos} = rs
        // 企业介绍
        $('.introduction h2').text(name)
        introduction && $('.introduction .ch-content').html(introduction.replace('<br>', ''))
        // 企业文化
        $('.culture .name').text(name)
        culture && $('.culture .ch-content').html(culture)
        // 技术创新
        renovation && $('.renovation .ch-content').html(renovation)
        // 企业风貌
        photos && app.renderSwiper(photos, '.photos-swiper')
        // 资质荣誉
        honors && app.renderSwiper(honors, '.honors-swiper')
        // 主营产品
        productions && app.renderSwiper(productions, '.productions-swiper')
    },
    renderSwiper(data, _class) {
        Promise.all(data.map(i => app.getFileUrl(i.url))).then((rs) => {
            if (_class === '.photos-swiper') {
                const _rs = app.chunk(rs, 6)
                for (let i = 0; i < _rs.length; i++) {
                    let imgLis = []
                    for (let j = 0; j < _rs[i].length; j++) {
                        imgLis.push(`
                          <img src="${_rs[i][j]}" alt="">
            `)
                    }
                    const dom = `
                <div class="swiper-slide">
                    ${imgLis.map(i => i).join(' ')}
                </div>
                `
                    $('.photos .swiper-wrapper').append(dom)
                }
            }
            for (let i = 0; i < rs.length; i++) {
                if (_class === '.productions-swiper') {
                    const dom = `
            <div class="swiper-slide">
              <img src="${rs[i]}" alt="">
              <div class="pro-info">
                    <div class="pro-info-name">${data[i].name}</div>
                    <div class="cut-line"></div>
                    <div class="pro-info-cont ch-content">${data[i].function}</div>
              </div>
            </div>
            `
                    $('.productions .swiper-wrapper').append(dom)
                }
                if (_class === '.honors-swiper') {
                    const dom = `
            <div class="swiper-slide">
              <img src="${rs[i]}" alt="">
            </div>
            `
                    $('.honors .swiper-wrapper').append(dom)
                }
            }

            const swiperConfig = {
                '.productions-swiper': {
                    spaceBetween: 30,
                    slidesPerView: 3,
                },
                '.honors-swiper': {
                    spaceBetween: 17,
                    slidesPerView: 4,
                }
            }

            new Swiper(_class, {
                loop: false,
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination'
                },
                autoplay: {
                    disableOnInteraction: false,
                    delay: 5000
                },
                ...swiperConfig[_class]
            })
        })
    },
    getSearchParams() {
        const searchPar = new URLSearchParams(window.location.search)
        const paramsObj = {}
        for (const [key, value] of searchPar.entries()) {
            paramsObj[key] = value
        }
        return paramsObj
    },
    getFileUrl(filename) {
        if (!filename) return
        return new Promise(resolve => {
            $.ajax({
                type: 'POST',
                url: host + '/tmp_url/enterprise_show/presign_file_get',
                contentType: 'application/json', // 必须有
                data: JSON.stringify({
                    filename
                }),
                async: false,
                success: (rs) => {
                    resolve(rs.url.replace('http://59.195.26.153:8013/', 'https://szjj.dsj.taiyuan.gov.cn:7777/minio_endpoint/'))
                }
            })
        })
    },
    chunk(array, subGroupLength) {
        let index = 0;
        let newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    }
}
app.loadData()


