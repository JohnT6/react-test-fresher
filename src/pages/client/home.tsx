import MobileFilter from '@/components/client/book/mobile.filter';
import { getCategoryAPI, getListBookWithPaginateApi } from '@/services/api';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import {
    Row, Col, Form, Checkbox, Divider, InputNumber,
    Button, Rate, Tabs, Pagination,
    Spin,
    FormProps
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
// import MobileFilter from '@/components/client/book/mobile.filter';
import 'styles/home.scss';

type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};

const HomePage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [searchTerm] = useOutletContext() as any;


    const [listCategory, setListCategory] = useState<{
        label: string, value: string
    }[]>([]);

    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

    useEffect(() => {
        const initCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return {
                        label: item, value: item
                    }
                })
                setListCategory(d);
            }
        }
        initCategory();
    }, [])

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery, searchTerm])

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        if (searchTerm) {
            query += `&mainText=/${searchTerm}/i`;
        }

        const res = await getListBookWithPaginateApi(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }

    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        //only fire if category changes
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`)
            } else {
                //reset data -> fetch all
                setFilter('');
            }
        }

    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values?.category?.join(',');
                f += `&category=${cate}`
            }
            setFilter(f);
        }

    }

    const items = [
        { key: "sort=-sold", label: `Phổ biến`, children: <></> },
        { key: 'sort=-updatedAt', label: `Hàng Mới`, children: <></> },
        { key: 'sort=price', label: `Giá Thấp Đến Cao`, children: <></> },
        { key: 'sort=-price', label: `Giá Cao Đến Thấp`, children: <></> },
    ];

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto', overflow: "hidden" }}>
                    <Row gutter={[20, 20]}>

                        {/* ================= SIDEBAR BỘ LỌC ================= */}
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span>
                                        <FilterTwoTone />
                                        <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                    </span>
                                    <ReloadOutlined title="Reset" onClick={() => {
                                        form.resetFields()
                                        setFilter('');
                                    }} />
                                </div>
                                <Divider />
                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                                >

                                    <Form.Item name="category" label="Danh mục sản phẩm" labelCol={{ span: 24 }}>
                                        <Checkbox.Group>
                                            <Row>
                                                {listCategory.map((item, index) => (
                                                    <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                        <Checkbox value={item.value}>{item.label}</Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                                        <Row gutter={[10, 10]} style={{ width: "100%" }}>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={["range", 'from']}>
                                                    <InputNumber min={0} placeholder="đ TỪ" style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                                </Form.Item>
                                            </Col>
                                            <Col xl={2} md={0}>
                                                <div> - </div>
                                            </Col>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={["range", 'to']}>
                                                    <InputNumber min={0} placeholder="đ ĐẾN" style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <div>
                                            <Button onClick={() => form.submit()} style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                                        </div>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                                        <div><Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} /><span className="ant-rate-text"></span></div>
                                        <div><Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} /><span className="ant-rate-text">trở lên</span></div>
                                        <div><Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} /><span className="ant-rate-text">trở lên</span></div>
                                        <div><Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} /><span className="ant-rate-text">trở lên</span></div>
                                        <div><Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} /><span className="ant-rate-text">trở lên</span></div>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                        {/* ================= NỘI DUNG CHÍNH ================= */}
                        <Col md={20} xs={24}>
                            <Spin spinning={isLoading} tip="Loading...">
                                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                    <Row>
                                        <Tabs
                                            defaultActiveKey="sort=-sold"
                                            items={items}
                                            style={{ overflowX: "auto" }}
                                            onChange={(value) => { setSortQuery(value) }}
                                        />
                                        <Col xs={24} md={0}>
                                            <div style={{ marginBottom: 20 }}>
                                                <span onClick={() => setShowMobileFilter(true)}>
                                                    <FilterTwoTone />
                                                    <span style={{ fontWeight: 500 }}> Lọc</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className='customize-row'>
                                        {listBook.map((item, index) => (
                                            // CẤU HÌNH BUG FIX: Cột bao ngoài cho height 100%
                                            <div onClick={() => navigate(`/book/${item._id}`)} className="column" key={`book-${index}`} style={{ height: '100%', padding: '10px' }}>

                                                {/* CẤU HÌNH BUG FIX: Wrapper xài flex cột, height 100% */}
                                                <div className='wrapper' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                    <div className='thumbnail'>
                                                        {/* Ảnh giả để test layout */}
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" style={{ width: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div className='text' title={item.mainText} style={{ padding: '10px 0' }}>
                                                        {item.mainText}
                                                    </div>

                                                    {/* CẤU HÌNH BUG FIX: Đẩy cụm giá và rating xuống sát đáy bằng margin-top: auto */}
                                                    <div className='price' style={{ marginTop: 'auto', }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
                                                    </div>
                                                    <div className='rating' style={{ paddingTop: '5px' }}>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <span style={{ marginLeft: 8, fontSize: 12 }}>Đã bán {item?.sold ?? 0}</span>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </Row>

                                    <div style={{ marginTop: 30 }}></div>
                                    <Row style={{ display: "flex", justifyContent: "center" }}>
                                        <Pagination
                                            current={current}
                                            total={total}
                                            pageSize={pageSize}
                                            responsive
                                            onChange={(c, p) => handleOnchangePage({ current: c, pageSize: p })} />
                                    </Row>
                                </div>

                            </Spin>
                        </Col>
                    </Row>
                </div>
            </div >

            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                handleChangeFilter={handleChangeFilter}
                listCategory={listCategory}
                onFinish={onFinish}
            />
        </>
    )
}

export default HomePage;