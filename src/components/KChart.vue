<template>
    <div>
        <v-chart ref="chart" :class="{ chart: !candles.data?.isBig, chartBig: candles.data?.isBig, }" :option="option"
            :loading="loading" @legendselectchanged="legendselectchanged" autoresize />

        <el-select v-model="duringModel" placeholder="Select" size="small" class="duringSel" @change="duringChg">
            <el-option v-for="item in duringOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
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

const chart = ref()
const option = ref()
const loading = ref(false)
const duringModel = ref('1Y')
const fiveYearClose = ref([])
let candles = reactive({
    data: {
        isBig: false,    //是否放大
        width: '',

        originData: {},
        list: [],
        category: [],
        currentSel: {},
    }
})

onMounted(async () => {
    candles.data.width = chart.value.getWidth()

    loading.value = true
    let res = await API.Stock.getFcnt('FCNT000099', props.symbol)
    candles.data.originData = res.data.content.rawContent.day

    res = await API.Stock.getFcnt('FCNT000039', props.symbol)
    fiveYearClose.value = res.data.content.rawContent.reverse()
    console.log(res)

    let lastDate = new Date()

    if (duringModel.value == '1Y') {
        lastDate.setFullYear(lastDate.getFullYear() - 1)
    } else if (duringModel.value == '6M') {
        lastDate.setMonth(lastDate.getMonth() - 6)
    } else if (duringModel.value == '1M') {
        lastDate.setMonth(lastDate.getMonth() - 1)
    }

    let tmpData = candles.data.originData.filter(item => new Date(item.date) > lastDate)

    candles.data.list = tmpData.map(item => [item.open, item.close, item.low, item.high, item.change, item.change_rate, item.volumeOrAmount])
    candles.data.category = tmpData.map(item => Utils.dateFormate(item.date, 'yymmdd'))

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

                let lastClosePrice = candles.data.list[k.dataIndex - 1] ? candles.data.list[k.dataIndex - 1][1]
                    : fiveYearClose.value.find(item => Utils.dateFormate(item.date, 'yymmdd') < k.axisValue).close //上一K棒收價

                return `<div style=" text-align: left;">
                    ${params[0].name} <br/>
                    <span style="color:${setTooltipColor(k.value[1], lastClosePrice)}">開 :<span style="margin-left: 10px">${k.value[1]}</span></span><br/>
                    <span style="color:${setTooltipColor(k.value[2], lastClosePrice)}">收 :<span style="margin-left: 10px">${k.value[2]}</span></span><br/>
                    <span style="color:${setTooltipColor(k.value[3], lastClosePrice)}">低 :<span style="margin-left: 10px">${k.value[3]}</span></span><br/>
                    <span style="color:${setTooltipColor(k.value[4], lastClosePrice)}">高 :<span style="margin-left: 10px">${k.value[4]}</span></span><br/> 
                    <span style="color:${setTooltipColor(k.value[5])}">${k.value[5] > 0 ? '漲' : '跌'} :<span style="margin-left: 10px">${k.value[5]}</span></span><br/>
                    <span style="color:${setTooltipColor(k.value[5])}">幅 :<span style="margin-left: 10px">${k.value[6]}%</span></span><br/>
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

        ],
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '60%'
            },
            {
                left: '10%',
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
                    return value.min
                },

                max: (value) => {
                    return value.max
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
</style>