<template>
    <div>
        <!-- :update-options="{notMerge:true}"  https://juejin.cn/post/7329476133325193251 -->
        <v-chart ref="chart" :class="{ chart: !candles.data?.isBig, chartBig: candles.data?.isBig, }" :option="option"
            @legendselectchanged="legendselectchanged" autoresize />
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules/index.js'
import API from '@/apis'
import Utils from '@/utils'

const props = defineProps({
    symbol: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['reOrder'])
const indexStore = useIndexStore()
const chart = ref(null)
const option = ref(null)
const candles = reactive({
    socketData: {},

    data: {
        list: [],        //k棒
        volume: [],     //量
        trend: [],      //走勢   
        category: [],
        low: '',
        high: '',
        closePrice: '',  //收盤價
        priceUp: '',     //上漲點數
        percent: '',     //上漲幅度

        width: '',
        isBig: false,    //是否放大
        currentSel: '走勢'   //目前圖表     
    }
})

const upColor = '#FF5B5B';
const upBorderColor = '#ff3737';
const downColor = '#91F840';
const downBorderColor = '#6fda1a';

onMounted(() => {
    candles.data.width = chart.value.getWidth()
    setOption()

    const socket = new WebSocket('wss://api.fugle.tw/marketdata/v1.0/stock/streaming');

    socket.onopen = () => {
        socket.send(
            JSON.stringify({
                event: 'auth',
                data: {
                    apikey: 'YzY2MTY5OWQtMWQ3OC00OTMzLThiZTYtYzViMDA2ZmIzZTg3IDA1ZjEzNDc3LTMzYjAtNDY0OC1hMjVmLWJjODgzNTBkNTRlZQ==',
                },
            }),
        );

        socket.onmessage = (message) => {
            const data = JSON.parse(message.data);

            if (data.event === 'authenticated') {
                socket.send(
                    JSON.stringify({
                        event: 'subscribe',
                        data: {
                            channel: 'candles',
                            symbol: props.symbol,
                        },
                    }),
                );
            }

            if (data.event === 'snapshot') {
                candles.socketData = data.data
                setCandles()
            }

            console.log(data);
        };
    };

})

const setCandles = () => {
    candles.data.list = candles.socketData.data.map(item => [item.open, item.close, item.low, item.high])
    candles.data.trend = candles.socketData.data.map(item => { return { value: [Utils.dateFormate(item.date, 'hhmm'), item.close] } })

    let previousVol
    candles.data.volume = candles.socketData.data.map((item, key) => {

        let color = 1
        if (previousVol) {
            if (item.close > previousVol) {
                color = 1
            } else {
                color = -1
            }
        }

        previousVol = item.close

        return [key, item.volume, color]
    })

    candles.data.category = candles.socketData.data.map(item => Utils.dateFormate(item.date, 'hhmm'))
    candles.data.closePrice = candles.data.list[candles.data.list.length - 1][1]
    candles.data.low = candles.data.list.reduce((prev, curr) => (prev[1] < curr[1] ? prev : curr))[2]
    candles.data.high = candles.data.list.reduce((prev, curr) => (prev[1] > curr[1] ? prev : curr))[3]

    setOption()
}

const setOption = () => {
    option.value = {
        backgroundColor: '#131313',
        title: {
            text: '即時走勢',
            left: 10,
            top: 10,
            bottom: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 'normal',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(0,0,0,0.3)',
            textStyle: {
                color: '#FFF',
            },
            formatter: function (params) {
                let k = params.filter(item => item.seriesIndex == 0)[0]
                let v = params.filter(item => item.seriesIndex == 1)[0]
                let l = params.filter(item => item.seriesIndex == 2)[0]

                let lastClosePrice
                let up
                let percent

                if (k) {
                    lastClosePrice = candles.data.list[k.dataIndex - 1] ? candles.data.list[k.dataIndex - 1][1] : indexStore.info.data.previousClose  //上一K棒收價
                    up = (k.value[2] - lastClosePrice).toFixed(2)
                    percent = (up / lastClosePrice * 100).toFixed(2)

                    return `<div style=" text-align: left;">
                        ${params[0].name} <br/>
                        <span style="color:${setTooltipColor(k.value[1], lastClosePrice)}">開 :<span style="margin-left: 10px">${k.value[1]}</span></span><br/>
                        <span style="color:${setTooltipColor(k.value[2], lastClosePrice)}">收 :<span style="margin-left: 10px">${k.value[2]}</span></span><br/>
                        <span style="color:${setTooltipColor(k.value[3], lastClosePrice)}">低 :<span style="margin-left: 10px">${k.value[3]}</span></span><br/>
                        <span style="color:${setTooltipColor(k.value[4], lastClosePrice)}">高 :<span style="margin-left: 10px">${k.value[4]}</span></span><br/> 
                        <span style="color:${setTooltipColor(up)}">${up > 0 ? '漲' : '跌'} :<span style="margin-left: 10px">${up > 0 ? '+' + up : up}</span></span><br/>
                        <span style="color:${setTooltipColor(up)}">幅 :<span style="margin-left: 10px">${up > 0 ? '+' + percent : percent}%</span></span><br/>
                        量 :<span style="margin-left: 10px">${(v.value[1] / 100000000).toFixed(3)}億元</span><br/> 
                    </div>`;
                } else {
                    lastClosePrice = indexStore.info.data.previousClose
                    up = (l.value[1] - lastClosePrice).toFixed(2)
                    percent = (up / lastClosePrice * 100).toFixed(2)

                    return `<div style=" text-align: left;">
                        ${params[0].name} <br/>
                        <span style="color:${setTooltipColor(l.value[1], indexStore.info.data.previousClose)}">價 :<span style="margin-left: 10px">${l.value[1]}</span></span><br/>
                        <span style="color:${setTooltipColor(up)}">${up > 0 ? '漲' : '跌'} :<span style="margin-left: 10px">${up > 0 ? '+' + up : up}</span></span><br/>
                        <span style="color:${setTooltipColor(up)}">幅 :<span style="margin-left: 10px">${up > 0 ? '+' + percent : percent}%</span></span><br/>
                        量 :<span style="margin-left: 10px">${(v.value[1] / 100000000).toFixed(3)}億元</span><br/> 
                    </div>`;
                }


            },
            position: function (pos, params, el, elRect, size) {
                const obj = {
                    top: 10
                };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            }
        },
        axisPointer: {
            link: [
                {
                    xAxisIndex: 'all'
                }
            ],
            label: {
                backgroundColor: '#777'
            }
        },
        toolbox: {
            show: true,
            top: 10,
            right: 10,
            feature: {
                mytooo: {
                    show: true,
                    title: 'Custom Button',
                    icon: 'path://m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z',

                    onclick: function () {
                        chart.value.resize({
                            width: candles.data.isBig ? candles.data.width : candles.data.width * 2,
                        })
                        candles.data.isBig = !candles.data.isBig
                        emit('reOrder', candles.data.isBig, 0)
                    }
                }
            }
        },
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 0,
                end: 100
            },
            {
                show: false,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start: 0,
                end: 100
            }
        ],
        visualMap: [
            {
                show: false,
                seriesIndex: 1,
                dimension: 2,
                pieces: [
                    {
                        value: -1,
                        color: downColor
                    },
                    {
                        value: 1,
                        color: upColor
                    }
                ]
            },
            {
                show: false,
                seriesIndex: 2,
                dimension: 1,
                pieces: [
                    {
                        lte: indexStore.info.data.previousClose - 1,
                        color: downBorderColor
                    },
                    {
                        gt: indexStore.info.data.previousClose,
                        color: upBorderColor
                    },
                ]
            },
        ],
        legend: {
            selected: {
                '走勢': candles.data.currentSel == '走勢',
                '一分K': candles.data.currentSel == '一分K',
            },
            top: 10,
            selectedMode: 'single',
            data: ['走勢', '一分K',],
        },

        series: [
            {
                name: '一分K',
                type: 'candlestick',
                data: candles.data.list,
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: upBorderColor,
                    borderColor0: downBorderColor
                },
                tooltip: {
                    formatter: function (param) {
                        return param.name + '<br>' + (param.data.coord || '');
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: candles.data.volume
            },
            {
                name: '走勢',
                type: 'line',
                showSymbol: false,
                data: candles.data.trend,
                markLine: {
                    label: {
                        show: false
                    },
                    symbol: ['none', 'none'],
                    data: [
                        { yAxis: indexStore.info.data.previousClose, name: '固定值 100' }
                    ],
                    lineStyle: {
                        color: '#FFF',
                    }
                },
                markPoint: {
                    data: [
                        {
                            type: 'max',
                            name: 'Max',
                            label: {
                                position: 'top',
                                distance: -10
                            }
                        },
                        {
                            type: 'min',
                            name: 'Min',
                            label: {
                                position: 'bottom',
                                distance: -10
                            }
                        }
                    ],
                    symbol: 'image://',  // 不显示气泡或标记
                    label: {
                        show: true,  // 确保显示标签'

                        formatter: function (params) {
                            // 根据数值判断颜色
                            if (params.value > indexStore.info.data.previousClose) {
                                return `{a|${params.value}}`;
                            } else {
                                return `{b|${params.value}}`;
                            }
                        },
                        rich: {
                            a: {
                                color: upColor  // 大于1000时为红色
                            },
                            b: {
                                color: downColor // 小于或等于1000时为蓝色
                            }
                        },

                    }
                },
            },
        ],
        grid: [
            {
                left: '14%',
                right: '8%',
                height: '60%'
            },
            {
                left: '14%',
                right: '8%',
                top: '75%',
                height: '20%'
            },
        ],
        xAxis: [
            {
                type: 'category',
                data: candles.data.category,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
            },
            {
                type: 'category',
                gridIndex: 1,
                data: candles.data.category,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',  // 設置分隔線為虛線
                        color: '#3C3C3C',   // 設置分隔線顏色
                        width: 1         // 設置分隔線寬度
                    }
                },
                min: (value) => {
                    if (candles.data.currentSel == '一分K') {
                        return value.min
                    }

                    if (candles.data.low > indexStore.info.data.previousClose) {
                        return (indexStore.info.data.previousClose * 0.99).toFixed(0)
                    } else {
                        return (value.min * 0.99).toFixed(0)
                    }
                },

                max: (value) => {
                    if (candles.data.currentSel == '一分K') {
                        return value.max
                    }

                    if (candles.data.high > indexStore.info.data.previousClose) {
                        return (value.max * 1.01).toFixed(0)
                    } else {
                        return (indexStore.info.data.previousClose * 1.01).toFixed(0)
                    }

                },
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },

        ],
    }
}

const legendselectchanged = (params) => {
    candles.data.currentSel = params.name

    chart.value.resize()
}

const setTooltipColor = (closePrice, lastClosePrice = 0) => {
    if (closePrice == lastClosePrice) {
        return
    }

    if (closePrice > lastClosePrice) {
        return upColor
    } else {
        return downColor
    }
}
</script>

<style scoped>
.chart {
    height: 400px;
    width: 40vw;
    transition: width 1s ease;
}

.chartBig {
    height: 400px;
    width: 80vw;
    transition: width 1s ease;
}

@media screen and (max-width: 768px) {
    .chart {
        width: 95vw;
    }
}
</style>