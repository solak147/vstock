<template>
    <div class="relative h-fit">

        <v-chart ref="chart" :class="{ chart: !legalPerson.data?.isBig, chartBig: legalPerson.data?.isBig, }"
            :option="option" :loading="loading" @legendselectchanged="legendselectchanged" autoresize />

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

const emit = defineEmits(['reOrder'])
const chart = ref(null)
const option = ref(null)
const loading = ref(false)
const duringModel = ref('1Y')
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

const fiUpColor = '#f4af1c'
const fiDownColor = '#f4af1c66'
const itUpColor = '#EE8379'
const itDownColor = '#EE837966'
const dlUpColor = '#64A0DD'
const dlDownColor = '#64A0DD66'

let legalPerson = reactive({
    data: {
        isBig: false,    //是否放大
        width: '',

        originData: {},
        category: [],
        currentSel: {},

        FI: [],  //外資
        IT: [],  //投信
        DL: [],  //自營商
    }
})

onMounted(async () => {
    legalPerson.data.width = chart.value.getWidth()

    loading.value = true
    setOption()
    let res = await API.Stock.getFcnt('FCNT000005', props.symbol)
    legalPerson.data.originData = res.data.content.rawContent

    duringChg()

    loading.value = false
})

const duringChg = () => {
    let lastDate = new Date()

    if (duringModel.value == '1Y') {
        lastDate.setFullYear(lastDate.getFullYear() - 1)
    } else if (duringModel.value == '6M') {
        lastDate.setMonth(lastDate.getMonth() - 6)
    } else if (duringModel.value == '1M') {
        lastDate.setMonth(lastDate.getMonth() - 1)
    }

    let tmpData = legalPerson.data.originData.filter(item => new Date(item.date) > lastDate)

    legalPerson.data.category = tmpData.map(item => Utils.dateFormate(item.date, 'yymmdd'))

    legalPerson.data.FI = tmpData.map((item, key) => {
        let color = 1

        if (item.FIbuy > item.FIsell) {
            color = 1
        } else {
            color = -1
        }

        return [key, item.FIbuy - item.FIsell, color]
    })

    legalPerson.data.IT = tmpData.map((item, key) => {
        let color = 1

        if (item.ITbuy > item.ITsell) {
            color = 1
        } else {
            color = -1
        }

        return [key, item.ITbuy - item.ITsell, color]
    })

    legalPerson.data.DL = tmpData.map((item, key) => {
        let color = 1

        if (item.DLbuy > item.DLsell) {
            color = 1
        } else {
            color = -1
        }

        return [key, item.DLbuy - item.DLsell, color]
    })

    setOption()
}

const setOption = () => {
    option.value = {
        backgroundColor: '#131313',
        title: {
            text: '法人買賣超',
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
                let fi = params.filter(item => item.seriesIndex == 0)[0]
                let it = params.filter(item => item.seriesIndex == 1)[0]
                let dl = params.filter(item => item.seriesIndex == 2)[0]

                let sum = 0
                if (fi) sum += fi.value[1]
                if (it) sum += it.value[1]
                if (dl) sum += dl.value[1]
                sum = (sum / 1000).toFixed(0)

                return `<div style="text-align: left;">
                    ${params[0]?.axisValue} (仟元)<br/>
                    <span>
                        <span style="width:10px; height:10px; background:#f4af1c; display:inline-block;"></span>
                        外資 :<span style="margin-left: 10px; float: right;">${fi ? (fi.value[1] / 1000).toFixed(0) : 0}</span>
                    </span><br/>
                    <span>
                        <span style="width:10px; height:10px; background:#EE8379; display:inline-block;"></span>
                        投信 :<span style="margin-left: 10px; float: right;">${it ? (it.value[1] / 1000).toFixed(0) : 0}</span>
                    </span><br/>
                    <span>
                        <span style="width:10px; height:10px; background:#64A0DD; display:inline-block;"></span>
                        自營商 :<span style="margin-left: 10px; float: right;">${dl ? (dl.value[1] / 1000).toFixed(0) : 0}</span>
                    </span><br/>
                    <span>
                        <span style="width:10px; height:10px; background:#64A0DD; display:inline-block;"></span>
                        合計 :<span style="margin-left: 10px; float: right;">${sum}</span>
                    </span><br/>
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
                            width: legalPerson.data.isBig ? legalPerson.data.width : legalPerson.data.width * 2,
                        })

                        legalPerson.data.isBig = !legalPerson.data.isBig
                        emit('reOrder', legalPerson.data.isBig, 2,)
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
                seriesIndex: 0,
                dimension: 2,
                pieces: [
                    {
                        value: -1,
                        color: fiDownColor
                    },
                    {
                        value: 1,
                        color: fiUpColor
                    }
                ]
            },
            {
                show: false,
                seriesIndex: 1,
                dimension: 2,
                pieces: [
                    {
                        value: -1,
                        color: itDownColor
                    },
                    {
                        value: 1,
                        color: itUpColor
                    }
                ]
            },
            {
                show: false,
                seriesIndex: 2,
                dimension: 2,
                pieces: [
                    {
                        value: -1,
                        color: dlDownColor
                    },
                    {
                        value: 1,
                        color: dlUpColor
                    }
                ]
            },
        ],
        legend: {
            top: 10,
            selected: legalPerson.data.currentSel,
            data: ['外資', '投信', '自營商'],
        },

        series: [
            {
                name: '外資',
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                barGap: '-100%', // 使兩個柱狀圖重疊
                data: legalPerson.data.FI,
                itemStyle: {
                    color: fiUpColor  // 設置系列項目的顏色，這將影響 legend 中的 icon 顏色
                }
            },
            {
                name: '投信',
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: legalPerson.data.IT,
                itemStyle: {
                    color: itUpColor
                }
            },
            {
                name: '自營商',
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: legalPerson.data.DL,
                itemStyle: {
                    color: dlUpColor
                }
            },
        ],
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '75%'
            },
        ],
        xAxis: [
            {
                type: 'category',
                gridIndex: 0,
                data: legalPerson.data.category,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                gridIndex: 0,
                axisLabel: {
                    formatter: function (value, index) {
                        return value / 1000000000 + 'M';
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',  // 設置分隔線為虛線
                        color: '#3C3C3C',   // 設置分隔線顏色
                        width: 1         // 設置分隔線寬度
                    }
                },
            },

        ],
    }
}

const legendselectchanged = (params) => {
    legalPerson.data.currentSel = params.selected
    chart.value.resize()
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

.duringSel {
    position: absolute;
    z-index: 1;
    right: 50px;
    top: 14px;
    width: 60px;
}

:deep(.duringSel .el-select__wrapper) {
    color: #fff;
    background: transparent;
}
</style>
