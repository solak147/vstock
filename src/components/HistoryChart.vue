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
import Utils from '@/utils'

const props = defineProps({
    candles: {
        type: Object,
        default: {}
    },
})

const emit = defineEmits(['reOrder', 'chgLegend'])
const chart = ref(null)
const option = ref(null)
let candles = reactive({})

const upColor = '#FF5B5B';
const upBorderColor = '#ff3737';
const downColor = '#91F840';
const downBorderColor = '#6fda1a';

watch(
    () => props.candles,
    () => {
        candles = props.candles
        setOption()
    },
    {
        deep: true,
    }
)

onMounted(() => {
    candles = props.candles
    candles.data.width = chart.value.getWidth()
})

const setOption = () => {
    option.value = {
        backgroundColor: '#131313',
        title: {
            text: '股價走勢',
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
                return `<div style="text-align: left;">${params[0].value[0]}<div>
                        <div> 股價:<span style="padding-left: 10px">${params[0].value[1]}</span><div>`
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
                        emit('reOrder', candles.data.isBig, 1)
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
                seriesIndex: [0, 1, 2],
                dimension: 1,
                pieces: [
                    {
                        lte: candles.data.lastClose - 1,
                        color: downBorderColor
                    },
                    {
                        gt: candles.data.lastClose,
                        color: upBorderColor
                    },
                ]
            },
        ],
        legend: {
            selected: {
                '1M': candles.data.currentSel == '1M',
                '6M': candles.data.currentSel == '6M',
                '1Y': candles.data.currentSel == '1Y',
            },
            top: 10,
            selectedMode: 'single',
            data: ['1M', '6M', '1Y'],
        },

        series: setSeries(),
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '75%'
            },
            {
                left: '10%',
                right: '8%',
                height: '75%'
            },
            {
                left: '10%',
                right: '8%',
                height: '75%'
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
                    if (value.min > candles.data.lastClose) {
                        return (candles.data.lastClose * 0.9).toFixed(0)
                    } else {
                        return (value.min * 0.9).toFixed(0)
                    }
                },

                max: (value) => {
                    if (value.max > candles.data.lastClose) {
                        return (value.max * 1.1).toFixed(0)
                    } else {
                        return (candles.data.lastClose * 1).toFixed(0)
                    }
                },
            },

        ],
    }
}

const setSeries = () => {
    let seriesY = {
        name: '1Y',
        type: 'line',
        showSymbol: false,
        data: candles.data.trend,
        markLine: {
            label: {
                show: false
            },
            symbol: ['none', 'none'],
            data: [
                { yAxis: candles.data.lastClose, name: '固定值 100' }
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
                    if (params.value > candles.data.lastClose) {
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
    }

    let seriesM = Utils.deepClone({}, seriesY)
    seriesM.name = '1M'

    let series3M = Utils.deepClone({}, seriesY)
    series3M.name = '6M'

    return [seriesY, seriesM, series3M,]

}

const legendselectchanged = (params) => {
    candles.data.currentSel = params.name
    emit('chgLegend', params.name)
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