import { App, Breadcrumb, Col, Divider, Rate, Row } from "antd";
import ReactImageGallery from "react-image-gallery";
import ModalGallery from "./modal.gallery";
import { BsCartPlus } from "react-icons/bs";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useCurrentApp } from "@/components/context/app.context";
import { Link, useNavigate } from "react-router-dom";

interface IProps {
    currentBook: IBookTable | null;
}

type UserAction = "PLUS" | "MINUS"

const BookDetail = (props: IProps) => {
    const { currentBook } = props;
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])

    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const refGallery = useRef<ReactImageGallery>(null);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);

    const { setCarts, user } = useCurrentApp();
    const { message } = App.useApp();
    const navigate = useNavigate();



    // const images = [
    //     {
    //         original: 'https://picsum.photos/id/1018/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1015/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1019/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1018/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1015/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1019/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1018/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1015/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1019/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    // ];

    useEffect(() => {
        if (currentBook) {
            //build images 
            const images = [];
            if (currentBook.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                )
            }
            if (currentBook.slider) {
                currentBook.slider?.map(item => {
                    images.push(
                        {
                            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image"
                        },
                    )
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])

    const handleChangeButton = (type: UserAction) => {
        if (type === "MINUS") {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === "PLUS" && currentBook) {
            if (currentQuantity === +currentBook?.quantity) return;
            setCurrentQuantity(currentQuantity + 1)
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < currentBook.quantity) {
                setCurrentQuantity(+value)
            }
        }
    }

    const handleOnClickImage = () => {
        //get current index onClick
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để sử dụng chức năng này")
            return
        }

        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            const carts = JSON.parse(cartStorage) as ICart[];

            const findIndex = carts.findIndex(item => item._id === currentBook._id)
            if (findIndex > -1) {
                carts[findIndex].quantity += currentQuantity;
            } else {
                carts.push({
                    _id: currentBook?._id,
                    quantity: currentQuantity,
                    detail: currentBook,
                })
            }

            localStorage.setItem("carts", JSON.stringify(carts))

            setCarts(carts)
            console.log("Check carts", carts);

        } else {
            const data = [{
                _id: currentBook?._id,
                quantity: currentQuantity,
                detail: currentBook,
            }]

            localStorage.setItem("carts", JSON.stringify(data))

            setCarts(data)
            console.log("Check data", data);

        }
        if (isBuyNow) {
            navigate("/order")
        } else
            message.success("Thêm sản phẩm vào giỏ hàng thành công.")
    }



    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: <Link to={"/"}>Trang Chủ</Link>,
                            },

                            {
                                title: 'Xem chi tiết sách',
                            },
                        ]}
                    />
                    <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ReactImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ReactImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className='author'>Tác giả: <a href='#'>{currentBook?.author}</a> </div>
                                    <div className='title'>{currentBook?.mainText} </div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" />
                                            Đã bán {currentBook?.sold ?? 0}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}
                                        </span>
                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left'>Vận chuyển</span>
                                            <span className='right'>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left'>Số lượng</span>
                                        <span className='right'>
                                            <button onClick={() => handleChangeButton("MINUS")} ><MinusOutlined /></button> {/*onClick={() => handleChangeButton('MINUS')} */}
                                            <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />{/*onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} */}
                                            <button onClick={() => handleChangeButton("PLUS")}><PlusOutlined /></button>{/*onClick={() => handleChangeButton('PLUS')} */}
                                        </span>
                                    </div>
                                    <div className='buy'>
                                        <button onClick={() => handleAddToCart()} className='cart' >
                                            <BsCartPlus className='icon-cart' />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button
                                            onClick={() => handleAddToCart(true)}
                                            className='now'>Mua ngay</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
                <ModalGallery
                    isOpen={isOpenModalGallery}
                    setIsOpen={setIsOpenModalGallery}
                    currentIndex={currentIndex}
                    items={imageGallery}
                    title={currentBook?.mainText ?? ""}
                />
            </div>
        </>
    )
}

export default BookDetail