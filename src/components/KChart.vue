<template>
    <div class="relative">
        <v-chart ref="chart" :class="{ chart: !candles.data?.isBig, chartBig: candles.data?.isBig, }" :option="option"
            :loading="loading" @legendselectchanged="legendselectchanged" autoresize />

        <div v-if="maTxt.ma5" class="flex maWrap">
            <div :style="`color:${ma5Color}`" class="w-110 text-left">5MA：{{ maTxt.ma5 }}</div>
            <div :style="`color:${ma10Color}`" class="w-110 text-left">5MA：{{ maTxt.ma10 }}</div>
            <div :style="`color:${ma20Color}`" class="w-110 text-left">5MA：{{ maTxt.ma20 }}</div>
            <div :style="`color:${ma60Color}`" class="w-110 text-left">5MA：{{ maTxt.ma60 }}</div>
        </div>


        <div v-if="kdTxt.k9" class="flex kdWrap">
            <div :style="`color:${ma10Color}`" class="w-80 text-left">K9：{{ kdTxt.k9 }}</div>
            <div :style="`color:${ma20Color}`" class="w-80 text-left">D9：{{ kdTxt.d9 }}</div>
        </div>

        <div v-if="macdTxt.dif" class="flex macdWrap">
            <div :style="`color:${ma5Color}`" class="w-80 text-left">DIF：{{ macdTxt.dif }}</div>
            <div :style="`color:${ma20Color}`" class="w-100 text-left">MACD：{{ macdTxt.macd }}</div>
            <div :style="`color:${upColor}`" class="w-100 text-left">D-M：{{ macdTxt.dm }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import { useIndexStore } from '@/store/modules/index.js'
import VChart, { THEME_KEY } from 'vue-echarts'
import API from '@/apis'
import Utils from '@/utils'

const props = defineProps({
    symbol: {
        type: String,
        default: ''
    },
})

const upColor = '#FF5B5B';
const upBorderColor = '#ff3737';
const downColor = '#91F840';
const downBorderColor = '#6fda1a';
const ma5Color = '#E5C362'
const ma10Color = '#EE8379'
const ma20Color = '#64A0DD'
const ma60Color = '#49B8BB'

const maTxt = reactive({
    ma5: '',
    ma10: '',
    ma20: '',
    ma60: '',
})

const kdTxt = reactive({
    k9: '',
    d9: '',
})

const macdTxt = reactive({
    dif: '',
    macd: '',
    dm: '',
})


const duringOptions = [
    {
        value: '1Y',
        label: '1Y',
    },
    {
        value: '6M',
        label: '6M',
    },
    {
        value: '1M',
        label: '1M',
    },
]

const indexStore = useIndexStore()
const chart = ref()
const option = ref()
const loading = ref(false)
const duringModel = ref('6M')
const fiveYearClose = ref([])
let candles = reactive({
    data: {
        isBig: false,    //是否放大
        width: '',

        list: [],
        trend5: [],
        trend10: [],
        trend20: [],
        trend60: [],
        category: [],
        currentSel: {},

        kdData: {},
        macdData: {},
    }
})

onMounted(async () => {
    candles.data.width = chart.value.getWidth()

    loading.value = true

    let nowDate = new Date()
    let lastDate = new Date()
    let maDate = new Date()
    let delKey

    if (duringModel.value == '1Y') {
        lastDate.setFullYear(nowDate.getFullYear() - 1)
        lastDate.setDate(lastDate.getDate() + 1)

        maDate.setFullYear(nowDate.getFullYear() - 1)
        maDate.setDate(maDate.getDate() - 120)
    } else if (duringModel.value == '6M') {
        lastDate.setMonth(nowDate.getMonth() - 6)
        lastDate.setDate(lastDate.getDate() + 1)

        maDate.setMonth(nowDate.getMonth() - 6)
        maDate.setDate(maDate.getDate() - 120)
    } else if (duringModel.value == '1M') {
        lastDate.setMonth(nowDate.getMonth() - 1)
        lastDate.setDate(lastDate.getDate() + 1)

        maDate.setMonth(nowDate.getMonth() - 1)
        maDate.setDate(maDate.getDate() - 120)
    }

    let res = await API.Stock.getStockHistory(props.symbol, 'D', Utils.dateFormate(lastDate, 'yymmdd'), Utils.dateFormate(nowDate, 'yymmdd'))
    res.data = res.data.reverse()
    candles.data.list = res.data.map(item => [item.open, item.close, item.low, item.high, item.change])
    candles.data.category = res.data.map(item => item.date)
    candles.data.trend = res.data.map(item => { return { value: [item.date, item.close] } })

    let resMa = await API.Stock.getStockHistory(props.symbol, 'D', Utils.dateFormate(maDate, 'yymmdd'), Utils.dateFormate(nowDate, 'yymmdd'))
    resMa.data = resMa.data.reverse()
    delKey = resMa.data.findIndex(item => item.date === candles.data.category[0])
    candles.data.trend5 = resMa.data.map(item => item.close)
    candles.data.trend5 = calculateMA(candles.data.trend5, 5)
    candles.data.trend5.splice(0, delKey)

    candles.data.trend10 = resMa.data.map(item => item.close)
    candles.data.trend10 = calculateMA(candles.data.trend10, 10)
    candles.data.trend10.splice(0, delKey)

    candles.data.trend20 = resMa.data.map(item => item.close)
    candles.data.trend20 = calculateMA(candles.data.trend20, 20)
    candles.data.trend20.splice(0, delKey)

    candles.data.trend60 = resMa.data.map(item => item.close)
    candles.data.trend60 = calculateMA(candles.data.trend60, 60)
    candles.data.trend60.splice(0, delKey)

    let resClose = await API.Stock.getFcnt('FCNT000039', props.symbol)
    fiveYearClose.value = resClose.data.content.rawContent.reverse()
    let previousVol = fiveYearClose.value.find(item => Utils.dateFormate(item.date, 'yymmdd') < candles.data.category[0]).close

    candles.data.volume = res.data.map((item, key) => {

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

    let kdParam = {
        closingPrices: resMa.data.map(item => item.close),
        highPrices: resMa.data.map(item => item.high),
        lowPrices: resMa.data.map(item => item.low),
    }

    candles.data.kdData = calculateKD(kdParam.closingPrices, kdParam.highPrices, kdParam.lowPrices)
    candles.data.kdData.k.splice(0, delKey)
    candles.data.kdData.d.splice(0, delKey)

    candles.data.macdData.dif = indexStore.tec5Years.data.day.map(item => item.ema12 - item.ema26)
    candles.data.macdData.dea = indexStore.tec5Years.data.day.map(item => item.ema12_26)
    candles.data.macdData.macd = indexStore.tec5Years.data.day.map(item => item.osc)


    delKey = indexStore.tec5Years.data.day.findIndex(item => Utils.dateFormate(item.date, 'yymmdd') === candles.data.category[0])
    candles.data.macdData.dif.splice(0, delKey)
    candles.data.macdData.dea.splice(0, delKey)
    candles.data.macdData.macd.splice(0, delKey)

    setOption()
    loading.value = false
})

const setOption = () => {
    option.value = {
        backgroundColor: '#131313',
        title: {
            text: '股價K線',
            left: 10,
            top: 10,
            bottom: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 'normal',
            }
        },
        graphic: {
            elements: [
                // {
                //     type: 'text',
                //     left: 330,
                //     top: 40,
                //     style: {
                //         text: '60MA：',
                //         font: '14px sans-serif',
                //         fill: ma60Color
                //     }
                // },
            ]
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
                let ma5 = params.filter(item => item.seriesIndex == 2)[0]
                let ma10 = params.filter(item => item.seriesIndex == 3)[0]
                let ma20 = params.filter(item => item.seriesIndex == 4)[0]
                let ma60 = params.filter(item => item.seriesIndex == 5)[0]
                let k9 = params.filter(item => item.seriesIndex == 6)[0]
                let d9 = params.filter(item => item.seriesIndex == 7)[0]
                let macd = params.filter(item => item.seriesIndex == 8)[0]
                let dif = params.filter(item => item.seriesIndex == 9)[0]
                let dea = params.filter(item => item.seriesIndex == 10)[0]

                let lastClosePrice = candles.data.list[k.dataIndex - 1] ? candles.data.list[k.dataIndex - 1][1]
                    : fiveYearClose.value.find(item => Utils.dateFormate(item.date, 'yymmdd') < k.axisValue).close //上一K棒收價
                let up = (k.value[2] - lastClosePrice).toFixed(2)
                let percent = (up / lastClosePrice * 100).toFixed(2)

                if (ma5) {
                    maTxt.ma5 = ma5.value
                    maTxt.ma10 = ma10.value
                    maTxt.ma20 = ma20.value
                    maTxt.ma60 = ma60.value
                }

                if (k9) {
                    kdTxt.k9 = k9.value.toFixed(2)
                    kdTxt.d9 = d9.value.toFixed(2)
                }

                if (macd) {
                    macdTxt.dif = dif.value.toFixed(2)
                    macdTxt.macd = macd.value.toFixed(2)
                    macdTxt.dm = (dif.value - macd.value).toFixed(2)
                }

                return `<div style=" text-align: left;">
                    ${params[0].name} <br/>
                    <span style="color:${setTooltipColor(k.value[1], lastClosePrice)}">開 :<span style="margin-left: 10px">${k.value[1]}</span></span><br/>
                    <span style="color:${setTooltipColor(k.value[2], lastClosePrice)}">收 :<span style="margin-left: 10px">${k.value[2]}</span></span><br/>
                    <span style="color:${setTooltipColor(k.value[3], lastClosePrice)}">低 :<span style="margin-left: 10px">${k.value[3]}</span></span><br/>
                    <span style="color:${setTooltipColor(k.value[4], lastClosePrice)}">高 :<span style="margin-left: 10px">${k.value[4]}</span></span><br/> 
                    <span style="color:${setTooltipColor(up)}">${up > 0 ? '漲' : '跌'} :<span style="margin-left: 10px">${up > 0 ? '+' + up : up}</span></span><br/>
                    <span style="color:${setTooltipColor(up)}">幅 :<span style="margin-left: 10px">${up > 0 ? '+' + percent : percent}%</span></span><br/>
                    量 :<span style="margin-left: 10px">${(k.value[7] / 100000000).toFixed(3)}億元</span><br/> 
                </div>`;



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
                xAxisIndex: [0, 1, 2, 3],
                start: 0,
                end: 100
            },
            {
                show: false,
                xAxisIndex: [0, 1, 2, 3],
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
                seriesIndex: 8,
                dimension: 1,
                pieces: [
                    {
                        gt: 0,
                        color: upColor
                    },
                    {
                        lte: 0,
                        color: downColor
                    }
                ]
            },
        ],
        legend: {
            selected: {
                '日': candles.data.currentSel == '日',
            },
            top: 10,
            selectedMode: 'single',
            data: ['日',],
        },

        series: [
            {
                name: '日',
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
                name: 'MA5',
                type: 'line',
                data: candles.data.trend5,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.5,
                    color: ma5Color
                },
                itemStyle: {
                    color: ma5Color
                },
            },
            {
                name: 'MA10',
                type: 'line',
                data: candles.data.trend10,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.5,
                    color: ma10Color
                },
                itemStyle: {
                    color: ma10Color
                },
            },
            {
                name: 'MA20',
                type: 'line',
                data: candles.data.trend20,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.5,
                    color: ma20Color
                },
                itemStyle: {
                    color: ma20Color
                },
            },
            {
                name: 'MA60',
                type: 'line',
                data: candles.data.trend60,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.5,
                    color: ma60Color
                },
                itemStyle: {
                    color: ma60Color
                },
            },
            {
                name: 'K線',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: candles.data.kdData.k,
                smooth: true,
                lineStyle: {
                    color: ma20Color
                },
                markLine: {
                    label: {
                        show: false
                    },
                    symbol: ['none', 'none'],
                    data: [
                        { yAxis: 20, name: '固定值 20' },
                        { yAxis: 50, name: '固定值 50' },
                        { yAxis: 80, name: '固定值 80' },
                    ],
                    lineStyle: {
                        color: '#4d4d4d',
                    }
                },
            },
            {
                name: 'D線',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: candles.data.kdData.d,
                smooth: true,
                lineStyle: {
                    color: ma10Color
                }
            },
            {
                name: 'MACD',
                type: 'bar',
                xAxisIndex: 3,
                yAxisIndex: 3,
                data: candles.data.macdData.macd
            },
            {
                name: 'DIF',
                type: 'line',
                xAxisIndex: 3,
                yAxisIndex: 3,
                data: candles.data.macdData.dif,
                smooth: true,
                lineStyle: {
                    color: ma5Color
                }
            },
            {
                name: 'DEA',
                type: 'line',
                xAxisIndex: 3,
                yAxisIndex: 3,
                data: candles.data.macdData.dea,
                smooth: true,
                lineStyle: {
                    color: ma20Color
                }
            },
        ],
        grid: [
            {
                left: '10%',
                right: '8%',
                top: '8%',
                height: '30%'
            },
            {
                left: '10%',
                right: '8%',
                top: '37%',
                height: '15%'
            },
            {
                left: '10%',
                right: '8%',
                top: '55%',
                height: '15%'
            },
            {
                left: '10%',
                right: '8%',
                top: '75%',
                height: '15%'
            },
        ],
        xAxis: [
            {
                scale: true,
                type: 'category',
                data: candles.data.category,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
            },
            {
                scale: true,
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
            {
                scale: true,
                type: 'category',
                gridIndex: 2,
                data: candles.data.category,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            {
                scale: true,
                type: 'category',
                gridIndex: 3,
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
                    return (value.min * 0.95).toFixed(0)
                },

                max: (value) => {
                    return (value.max * 1.05).toFixed(0)
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
            {
                scale: true,
                gridIndex: 2,
                axisLabel: {
                    formatter: function (value) {
                        if (value === 20 || value === 50 || value === 80) {
                            return value;
                        }
                        return '';
                    }
                },
                min: 0,
                max: 100,
                interval: 10,  //调整刻度间隔
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },
            {
                scale: true,
                gridIndex: 3,
                splitLine: {
                    lineStyle: {
                        type: 'dashed',  // 設置分隔線為虛線
                        color: '#3C3C3C',   // 設置分隔線顏色
                        width: 1         // 設置分隔線寬度
                    }
                },
                axisLine: { show: false },
                axisTick: { show: false },

            },
        ],
    }
}

const calculateMA = (data, dayCount) => {
    let result = [];
    for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (let j = 0; j < dayCount; j++) {
            sum += +data[i - j];
        }
        result.push((sum / dayCount).toFixed(2));
    }
    return result;
}

const calculateKD = (closingPrices, highPrices, lowPrices, periodK = 9, periodD = 9) => {
    var rsv = [];
    var k = [];
    var d = [];

    for (var i = 0; i < closingPrices.length; i++) {
        var recentHigh = Math.max(...highPrices.slice(Math.max(0, i - periodK + 1), i + 1));
        var recentLow = Math.min(...lowPrices.slice(Math.max(0, i - periodK + 1), i + 1));
        var currentRSV = (closingPrices[i] - recentLow) / (recentHigh - recentLow) * 100;
        rsv.push(currentRSV);

        if (i === 0) {
            k.push(currentRSV);
            d.push(currentRSV);
        } else {
            k.push(k[i - 1] * 2 / 3 + currentRSV * 1 / 3);
            d.push(d[i - 1] * 2 / 3 + k[i] * 1 / 3);
        }
    }

    return { k, d };
}

// 计算指数平滑移动平均线（EMA）
// const calculateEMA = (prices, period) => {
//     let ema = [];
//     let multiplier = 2 / (period + 1);

//     for (var i = 0; i < prices.length; i++) {
//         if (i === 0) {
//             ema.push(prices[i]); // 第一个值直接使用价格
//         } else {
//             ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
//         }
//     }
//     return ema;
// }

// 计算MACD指标
// const calculateMACD = (closingPrices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
//     let emaShort = calculateEMA(closingPrices, shortPeriod);
//     let emaLong = calculateEMA(closingPrices, longPeriod);
//     let dif = emaShort.map((value, index) => value - emaLong[index]);

//     let dea = calculateEMA(dif, signalPeriod);
//     let macd = dif.map((value, index) => value - dea[index]); // MACD柱状图

//     return { dif, dea, macd };
// }

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
    height: 900px;
    width: 40vw;
    transition: width 1s ease;
}

.chartBig {
    height: 900px;
    width: 80vw;
    transition: width 1s ease;
}

.maWrap {
    position: absolute;
    z-index: 1;
    top: 35px;
    left: 10px;
    font-size: .8rem;
}

.kdWrap {
    position: absolute;
    z-index: 1;
    top: 480px;
    left: 10px;
    font-size: .8rem;
}

.macdWrap {
    position: absolute;
    z-index: 1;
    top: 640px;
    left: 10px;
    font-size: .8rem;
}
</style>