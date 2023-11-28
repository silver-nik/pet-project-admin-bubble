import React from "react"

const SketonMainPage = ({}) => {
    return (
                <div className="main-element__top d-flex">

                    <div className="card">
                        <p className="skeleton-text"></p>
                        <p className="skeleton-text"></p>
                        <div className="d-flex card-statistic">
                            <div className="me-5 mt-3">
                                <p className="skeleton-text text-muted"></p>
                                <h3 className="skeleton-text text-primary fs-30 font-weight-medium"></h3>
                            </div>
                            <div className="me-5 mt-3">
                                <p className="skeleton-text text-muted"></p>
                                <h3 className="skeleton-text text-primary fs-30 font-weight-medium"></h3>
                            </div>
                        </div>
                        <div id="acquisitions" className="skeleton-block"></div>
                    </div>

                    <div className="grid-cards d-flex">
                        <div className="d-flex card-tale">
                            <p className="card-title skeleton-text"></p>
                            <p className="card-body skeleton-text"></p>
                            <p className="card-footer skeleton-text"></p>
                        </div>
                        <div className="d-flex card-tale card-light-danger">
                            <p className="card-title skeleton-text"></p>
                            <p className="card-body skeleton-text"></p>
                            <p className="card-footer skeleton-text"></p>
                        </div>
                        <div className="d-flex card-tale">
                            <p className="card-title skeleton-text"></p>
                            <p className="card-body skeleton-text"></p>
                            <p className="card-footer skeleton-text"></p>
                        </div>
                        <div className="d-flex card-tale card-light-blue">
                            <p className="card-title skeleton-text"></p>
                            <p className="card-body skeleton-text"></p>
                            <p className="card-footer skeleton-text"></p>
                        </div>
                    </div>

                </div>

    )
}

const SkeletonMainPageDought = () => {
    return (
        <div className="main-element__statistic-section d-flex">

            <div className="statistic-traffic">
            <p className="card-title skeleton-text"></p>
                <p className="font-weight-500 skeleton-text"></p>
                <div id="doughnut" className="skeleton-block doughnut-skeleton"></div>
            </div>

            {/* <table className="uk-table uk-table-small uk-table-divider" >
                <tbody>
                    <tr className="table-traffic-li">
                        <td className="traffic-title skeleton-text"></td>
                        <td className="skeleton-conteiner d-flex">
                            <td className="text-muted skeleton-text"></td>
                            <td className="px-0 skeleton-text">
                            </td>
                            <td className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></td>
                        </td>
                        <td className="skeleton-conteiner d-flex">
                            <td className="text-muted skeleton-text"></td>
                            <td className="px-0 skeleton-text">
                            </td>
                            <td className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></td>
                        </td>
                        <td className="skeleton-conteiner d-flex">
                            <td className="text-muted skeleton-text"></td>
                            <td className="px-0 skeleton-text">
                            </td>
                            <td className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></td>
                        </td>
                        <td className="skeleton-conteiner d-flex">
                            <td className="text-muted skeleton-text"></td>
                            <td className="px-0 skeleton-text">
                            </td>
                            <td className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></td>
                        </td>
                        <td className="skeleton-conteiner d-flex">
                            <td className="text-muted skeleton-text"></td>
                            <td className="px-0 skeleton-text">
                            </td>
                            <td className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></td>
                        </td>
                        <td className="skeleton-conteiner d-flex">
                            <td className="text-muted skeleton-text"></td>
                            <td className="px-0 skeleton-text">
                            </td>
                            <td className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></td>
                        </td>
                    </tr>
                </tbody>
            </table> */}
            <table className="uk-table uk-table-small uk-table-divider" >
                <tbody>
                    <tr className="table-traffic-li">
                    <td className="traffic-title skeleton-text"></td>
                    <td className="skeleton-conteiner d-flex">
                        <div className="text-muted skeleton-text"></div>
                        <div className="px-0 skeleton-text"></div>
                        <div className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></div>
                    </td>
                    <td className="skeleton-conteiner d-flex">
                        <div className="text-muted skeleton-text"></div>
                        <div className="px-0 skeleton-text"></div>
                        <div className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></div>
                    </td>
                    <td className="skeleton-conteiner d-flex">
                        <div className="text-muted skeleton-text"></div>
                        <div className="px-0 skeleton-text"></div>
                        <div className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></div>
                    </td>
                    <td className="skeleton-conteiner d-flex">
                        <div className="text-muted skeleton-text"></div>
                        <div className="px-0 skeleton-text"></div>
                        <div className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></div>
                    </td>
                    <td className="skeleton-conteiner d-flex">
                        <div className="text-muted skeleton-text"></div>
                        <div className="px-0 skeleton-text"></div>
                        <div className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></div>
                    </td>
                    <td className="skeleton-conteiner d-flex">
                        <div className="text-muted skeleton-text"></div>
                        <div className="px-0 skeleton-text"></div>
                        <div className="skeleton-text"><h5 className="font-weight-bold mb-0"></h5></div>
                    </td>
                    </tr>
                </tbody>
            </table>

        </div>
    )
}

export { SketonMainPage, SkeletonMainPageDought };
