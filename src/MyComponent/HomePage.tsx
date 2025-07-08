import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { HeroSectionData } from '@/Dummydata/HomePageData';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className=" w-full border rounded-lg">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    HeroSectionData.map(sliderData => (
                        <SwiperSlide className=''>
                            <div className="relative rounded-lg w-full overflow-hidden">
                                <img
                                    alt=""
                                    className="rounded-lg overflow-hidden transition-all duration-250 ease-in"
                                    src={sliderData.image}
                                />
                                <div className="absolute bg-blue-500/30 inset-0 flex items-center justify-center">
                                    <div className=' w-full  md:w-3/4 lg:w-1/2 p-5 rounded-lg text-white'>
                                        <h1 className=" text-2xl md:text-3xl lg:text-5xl font-bold text-center">
                                            {sliderData.title}
                                        </h1>
                                        <p className="text-center my-3 text-[14px] md:text-base lg:text-base font-medium">
                                            {sliderData.description}
                                        </p>
                                        <Link to='/books' className='flex justify-center'><button className='mx-auto btn'>Discover Book</button></Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};

export default HomePage;