import { Chart } from "chart.js/auto";

export default function Graphs() {

    const createDoughnutGraph = (className, dataSearch) => {
        let doughnut;

        if(doughnut) {
            doughnut.destroy();
        } else {
            doughnut = new Chart(
                document.getElementById(className),
                {
                    type: 'doughnut',
                    data: {
                        labels: dataSearch.map(row => row.name),
                        datasets: [{
                            label: 'My First Dataset',
                            data: dataSearch.map(row => row.summary),
                            backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                            ],
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        aspectRatio: 1,
                        plugins: {
                            legend: {
                                position: 'right',
                                useBorderRadius: true,
                                borderRadius: 50,
                                onClick: () => {
                                    
                                }
                            }                      
                        },
                    }
                }
            )

        }
    }

    const createLineGraph = (className, data) => {

        let chart;

        const chartAreaBorder = {
            id: 'chartAreaBorder',
            beforeDraw(chart, args, options) {
                const {ctx} = chart;
                ctx.save();
                ctx.dispaly = options.dispaly;
                ctx.restore();
            }
        };

        if(chart) {
            chart.destroy();
        } else {

            chart = new Chart(
                document.getElementById(className),
                {
                type: 'line',
                data: {
                    labels: data.map(row => row.year),
                    datasets: [
                    {
                        borderWidth: 2,
                        tension: 0.4,
                        borderColor:"#f96868",
                        backgroundColor: "#f96868",
                        label: 'Регистрации',
                        data: data.map(row => row.data.registration),
                    },
                    {
                        borderWidth: 2,
                        borderColor:"#4B49AC",
                        backgroundColor: "#4B49AC",
                        tension: 0.4,
                        yAxisID: 'y',
                        label: 'Покупки',
                        data: data.map(row => row.data.purchase)
                    }
                    ]
                },
                    options: {
                        responsive: true,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        stacked: false,
                        plugins: {
                            title: {
                                display: false,
                                text: 'Chart.js Line Chart - Multi Axis'
                            },
                            legend: {
                                display: false,
                            },
                            chartAreaBorder: {
                                dispaly: false
                            }                        
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                border: {
                                    display: false
                                },
                                ticks: {
                                    stepSize: 20,
                                    color: function(context) {
                                        let body = document.querySelector('body');
                                        if (body.classList.contains('Nightfall')) {
                                          return '#fff';
                                        } else if (body.classList.contains('Eclipse')) {
                                          return '#666';
                                        } else if (body.classList.contains('Sunrise')) {
                                          return '#666';
                                        }
                                    }
                                },
                            },

                            x: {
                                grid: {
                                display: false,
                                },
                                border: {
                                    display: false
                                },
                                ticks: {
                                    color: function(context) {
                                        let body = document.querySelector('body');
                                        if (body.classList.contains('Nightfall')) {
                                          return '#fff';
                                        } else if (body.classList.contains('Eclipse')) {
                                          return '#666';
                                        } else if (body.classList.contains('Sunrise')) {
                                          return '#666';
                                        }
                                    }
                                }
                            }
                        
                        }
                    },
                    plugins: [chartAreaBorder]
                }
            )
        }
    }

    return { createDoughnutGraph, createLineGraph };
}