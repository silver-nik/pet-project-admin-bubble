import React, { useState, useEffect } from "react";
import { SkeletonMainPageDought, SketonMainPage } from "../../skeletons/main-page-skeleton";
import Graphs from "../../editor/graphs/graphs";
import Services from "../../../services/services";

export default function ConfirmModal({themeId, isLoaded, isLoading, loading, notifications, name}) {
    const [trafficData, setTrafficData] = useState([]);
    const [data, setData] = useState([]);
    const [dataSearch, setDataSearch] = useState([]);

    const [summReg, setSummReg] = useState(0);
    const [summOrder, setSummOrder] = useState(0);

    const graphsCopy = new Graphs();
    const services = new Services();

    const [activeTabs, setActiveTabs] = useState({
        generalData: true,
        fullDetail: false,
    })

    const monthArr = ['January', 'Feburary', 'March', 'April', 'May'];
    const ordersFilterArr = ['за 24 часа', 'за 7 дней','за 30 дней'];

    const [currentMonth, setCurrentMonth] = useState('January');
    const [currentOrderFilter, setCurrentOrderFilter] = useState(ordersFilterArr[0]);

    const createDataGraph = () => {

        isLoading();

        services.getDataGraph()
            .then(res => {

                let conversions = res.conversions;
                let traffic = res.trafficSources;

                Object.keys(conversions).forEach((key) => {
                    let value = conversions[key];

                    setData(data => [...data, {year: key, data: value}])
                    setSummOrder(summOrder => summOrder += value.purchase);
                    setSummReg(summReg => summReg += value.registration);

                });
                

                Object.keys(traffic).forEach((key) => {
                    let value = traffic[key];
                    let allTraffic = Object.values(value).flatMap(Object.values),
                        summTraffic = allTraffic.reduce((a, b) => a + b);

                    setDataSearch(dataSearch => [...dataSearch, { 
                        name: key,
                        data: value,
                        summary: summTraffic
                    }])

                });

            })
            .finally(() => setTimeout(() => {
                isLoaded()
            }, 4000))
    }

    const getActualData = () => {
        isLoading();

        services.getDataGraph()
            .then(res => {
                console.log(res);
            })
    }

    const calcProgress = (num, sum) => {

        let n = (num / sum) * 100;
        return n + '%';

    }

    const setProgressLines = (data, sum) => {
        if(data) {
            return Object.entries(data).map(([key, value], i) => (
                <td className="progress-td" key={Math.random() * i}>
                    <div className="text-muted progress-title">{key}</div>
                    <div className="w-100 px-0 ">
                        <div className="progress">
                            <div className="progress-bar bg-danger" role="progressbar" style={{ width: calcProgress(value, 1000) }} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div className="progress-value"><h5 className="font-weight-bold mb-0">{value}</h5></div>
                </td>
            ))
        } 
        
        if (sum) {
            return (
                <td className="progress-td">
                    <div className="text-muted progress-title" key={Math.floor(Math.random() * 10)}>Остальные</div>
                    <div className="w-100 px-0 ">
                        <div className="progress">
                            <div className="progress-bar bg-danger" role="progressbar" style={{ width: calcProgress(sum, 1000) }} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div className="progress-value"><h5 className="font-weight-bold mb-0">{sum}</h5></div>
                </td>
            )
        }
    }

    const setDataTable = (data) => {
        return data.map((item, i) => {

            const {searchEngines, socialMedia, other} = item.data; 

            let sum  = 0;

            Object.values(other).map((value) => {sum += value})

            return (

                <tr className="table-traffic-li" key={Math.random()}>
                    <td className="traffic-title ">{item.name}</td>
                    {
                        setProgressLines(searchEngines)
                    }
                    {
                        setProgressLines(socialMedia)
                    }
                    {
                        setProgressLines('', sum)
                    }
                </tr>

            )
            

        })
    }

    const setEventToTab = () => {
        document.querySelectorAll('.main-element__filter-tabs li').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();

                let tabName = e.target.getAttribute('data-filter');

                document.querySelectorAll('.main-element__filter-tabs li').forEach(el => {
                    el.classList.remove('active-filter')
                })

                e.target.classList.add('active-filter')

                setActiveTabs(activeTabs => ({
                    generalData: false,
                    fullDetail: false,                    
                    [tabName]: true
                }))
            })

        })
    }

    const setGridCards = (data) => {
        return data.map(item => {
            return `
                <div className="d-flex card-tale">
                    <p className="card-title ">Today’s Bookings</p>
                    <p className="card-body ">4006</p>
                    <p className="card-footer ">10.00% (30 days)</p>
                </div>
            `
        })
    }

    const setOptions = (data) => {
        return data.map((item, i) => {
            return <li className="item" key={i} data-key={item}>{item}</li>
        })
    }
      
    const handleDropdown = (dropdown, arrow, open) => {
        if (open) {
            arrow.classList.add("rotated");
            dropdown.classList.add("active");
        } else {
            arrow.classList.remove("rotated");
            dropdown.classList.remove("active");
        }
    }

    const setEventListenerToSelect = () => { // этот метод есть в text-editor.js; Нужно объеденить и вынести в один метод 
        const selectedAll = document.querySelectorAll(".wrapper-dropdown");

        selectedAll.forEach((selected) => {
            const optionsContainer = selected.children[2];
            const optionsList = selected.querySelectorAll("div.wrapper-dropdown li");

            selected.addEventListener("click", () => {
                let arrow = selected.children[1];

                if (selected.classList.contains("active")) {
                    handleDropdown(selected, arrow, false);
                } else {
                    let currentActive = document.querySelector(".wrapper-dropdown.active");

                    if (currentActive) {
                        let anotherArrow = currentActive.children[1];
                        handleDropdown(currentActive, anotherArrow, false);
                    }

                    handleDropdown(selected, arrow, true);
                }
            });

            for (let o of optionsList) {
                o.addEventListener("click", () => {
                    selected.querySelector(".selected-display").innerHTML = o.innerHTML;

                    setCurrentMonth(o.getAttribute('data-key'))

                });
            }
        });
    }

    useEffect(() => {
        createDataGraph();

        getActualData();

        setEventToTab();

        setEventListenerToSelect();
    }, []);

    useEffect(() => {
        setTrafficData(dataSearch);
    }, [dataSearch]);

    useEffect(() => {

        if(!loading) {

            graphsCopy.createLineGraph('acquisitions', data);

        if (document.querySelector('.summ-reg')) {
            document.querySelector('.summ-reg').innerHTML = summReg;
        }

        if (document.querySelector('.summ-order')) {
            document.querySelector('.summ-order').innerHTML = summOrder;
        }

        // Трафик посещений

        graphsCopy.createDoughnutGraph('doughnut', dataSearch);
        
    }

    }, [loading]);
    
    return (
        <div className="d-flex">
            <div className="page__element main-element">
                <h2 className="uk-modal-title">Добро пожаловать, {name}</h2>
                <h6 className="">У вас <span className={Object.keys(notifications).length > 0 ? "text-primary" : ""}>{notifications && Object.keys(notifications).length > 0 ? Object.keys(notifications).length : 'нет'} непрочитанных уведомлении</span></h6>

                <ul className="main-element__filter-tabs">
                    <li className="active-filter" data-filter="generalData">Общая детализация</li>
                    <li data-filter="fullDetail">Полная детализация</li>
                </ul>

                {
                    activeTabs.generalData ? 

                    <div className="main-element__general-detail">
                    {loading ? <SketonMainPage/> : 
                    
                    <div className="main-element__top d-flex">
    
                        <div className="card">
                            <p className="card-title ">Информация по регистрациям / покупкам</p>
                            <p className="font-weight-500 ">Общее число покупок и регистраций. Эти данные отражают сколько пользователей зарегистрировалось и приобретало вашу продукцию</p>
                            <div className="d-flex card-statistic">
                                <div className="me-5 mt-3">
                                    <p className="text-muted ">Всего регистраций</p>
                                    <h3 className="text-primary fs-30 font-weight-medium summ-reg"></h3>
                                </div>
                                <div className="me-5 mt-3">
                                    <p className="text-muted ">Всего покупок</p>
                                    <h3 className="text-primary fs-30 font-weight-medium summ-order"></h3>
                                </div>
                            </div>
                            <canvas id="acquisitions" className=""></canvas>
                        </div>
    
                        <div className="grid-cards d-flex">
                            <div className="d-flex card-tale">
                                <p className="card-title ">Today’s Bookings</p>
                                <p className="card-body ">4006</p>
                                <p className="card-footer ">10.00% (30 days)</p>
                            </div>
                            <div className="d-flex card-tale card-light-danger">
                                <p className="card-title ">Today’s Bookings</p>
                                <p className="card-body ">4006</p>
                                <p className="card-footer ">10.00% (30 days)</p>
                            </div>
                            <div className="d-flex card-tale">
                                <p className="card-title ">Today’s Bookings</p>
                                <p className="card-body ">4006</p>
                                <p className="card-footer ">10.00% (30 days)</p>
                            </div>
                            <div className="d-flex card-tale card-light-blue">
                                <p className="card-title ">Today’s Bookings</p>
                                <p className="card-body ">4006</p>
                                <p className="card-footer ">10.00% (30 days)</p>
                            </div>
                        </div>
    
                    </div>
    
                    }
    
                    {loading ? <SkeletonMainPageDought/> :
    
                        <div className="main-element__statistic-section d-flex">
    
                            <div className="statistic-traffic ">
                            <p className="card-title">Информация по посещениям</p>
                                <p className="font-weight-500 ">Данные показывают источники через, которые пользователи переходили на ваш сайт</p>
                                <canvas id="doughnut"></canvas>
                            </div>
    
                            <table className="uk-table uk-table-small uk-table-divider" uk-slideshow="animation: fade;" >
                                <tbody className="uk-slideshow-items">
                                    {
                                        trafficData.length > 0 ? setDataTable(trafficData) : null
                                    }
                                </tbody>
                            </table>
    
                        </div>
                    }

                    {
                        
                        <div className="main-element__statistic-section d-flex">
    
                            <div className="w-100">
                               
                                <div className="statistic__top-content d-flex">
                                    <p className="card-title">Иcтория покупок</p>

                                    <div className="wrapper-dropdown wrapper-dropdown__small __color-background" id="dropdown">
                                        <span className="selected-display" id="destination">{currentOrderFilter}</span>
                                        <svg id="drp-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow transition-all ml-auto rotate-180">
                                            <path d="M7 14.5l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                        <ul className="dropdown">
                                            {ordersFilterArr.length > 0 ? setOptions(ordersFilterArr) : null}
                                        </ul>
                                    </div>
                                </div>

                                <table className="uk-table uk-table-small uk-table-divider purchase__data">
                                    <thead>
                                        <tr>
                                            <th>Товар</th>
                                            <th scope="col">Статус</th>
                                            <th scope="col">Дата</th>
                                            <th scope="col">Владелец</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">1С:Бухгалтерия</th>
                                            <th>
                                                <p className="purchase__status ps__confirm">
                                                    Оплачено
                                                </p>
                                            </th>
                                            <th scope="row">24.10.2023</th>
                                            <th>Никита Адм</th>
                                        </tr>
                                        <tr>
                                            <th scope="row">1С:Розница</th>
                                            <th>
                                                <p className="purchase__status ps__process">
                                                    В обработке
                                                </p>
                                            </th>
                                            <th scope="row">24.10.2023</th>
                                            <th>Александр Шевцов</th>
                                        </tr>
                                        <tr>
                                            <th scope="row">1С:Бухгалтерия</th>
                                            <th>Оплачено</th>
                                            <th scope="row">24.10.2023</th>
                                            <th>Лев Савин</th>
                                        </tr>
                                        <tr>
                                            <th scope="row">1С:Розница</th>
                                            <th>Оплачено</th>
                                            <th scope="row">24.10.2023</th>
                                            <th>Алексей Виноградов</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
    
                        </div>

                    }

                    </div> : null
                }

                {
                    activeTabs.fullDetail ? 

                    <div className="main-element__full-filter-detail">

                        <div className="filter-detail__inner-filters">

                            <div className="wrapper-dropdown wrapper-dropdown__small" id="dropdown">
                                <span className="selected-display" id="destination">{currentMonth}</span>
                                <svg id="drp-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow transition-all ml-auto rotate-180">
                                    <path d="M7 14.5l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                <ul className="dropdown">
                                    {monthArr.length > 0 ? setOptions(monthArr) : null}
                                </ul>
                            </div>

                        </div>

                        {loading ? <SketonMainPage/> : 
                        
                        <div className="main-element__top d-flex">

                            <div className="card">
                                <p className="card-title ">Информация по регистрациям / покупкам</p>
                                <p className="font-weight-500 ">Общее число покупок и регистраций. Эти данные отражают сколько пользователей зарегистрировалось и приобретало вашу продукцию</p>
                                <div className="d-flex card-statistic">
                                    <div className="me-5 mt-3">
                                        <p className="text-muted ">Всего регистраций</p>
                                        <h3 className="text-primary fs-30 font-weight-medium summ-reg"></h3>
                                    </div>
                                    <div className="me-5 mt-3">
                                        <p className="text-muted ">Всего покупок</p>
                                        <h3 className="text-primary fs-30 font-weight-medium summ-order"></h3>
                                    </div>
                                </div>
                                <canvas id="acquisitions" className=""></canvas>
                            </div>

                            <div className="grid-cards d-flex">
                                <div className="d-flex card-tale">
                                    <p className="card-title ">Today’s Bookings</p>
                                    <p className="card-body ">4006</p>
                                    <p className="card-footer ">10.00% (30 days)</p>
                                </div>
                                <div className="d-flex card-tale card-light-danger">
                                    <p className="card-title ">Today’s Bookings</p>
                                    <p className="card-body ">4006</p>
                                    <p className="card-footer ">10.00% (30 days)</p>
                                </div>
                                <div className="d-flex card-tale">
                                    <p className="card-title ">Today’s Bookings</p>
                                    <p className="card-body ">4006</p>
                                    <p className="card-footer ">10.00% (30 days)</p>
                                </div>
                                <div className="d-flex card-tale card-light-blue">
                                    <p className="card-title ">Today’s Bookings</p>
                                    <p className="card-body ">4006</p>
                                    <p className="card-footer ">10.00% (30 days)</p>
                                </div>
                            </div>

                        </div>

                        }

                        {/* {loading ? <SkeletonMainPageDought/> :

                            <div className="main-element__statistic-section d-flex">

                                <div className="statistic-traffic ">
                                <p className="card-title">Информация по посещениям</p>
                                    <p className="font-weight-500 ">Данные показывают источники через, которые пользователи переходили на ваш сайт</p>
                                    <canvas id="doughnut"></canvas>
                                </div>

                                <table className="uk-table uk-table-small uk-table-divider" uk-slideshow="animation: fade;" >
                                    <tbody className="uk-slideshow-items">
                                        {
                                            trafficData.length > 0 ? setDataTable(trafficData) : null
                                        }
                                    </tbody>
                                </table>

                            </div>
                        } */}
                    </div> : null
                }

            </div>
        </div>
    )

}