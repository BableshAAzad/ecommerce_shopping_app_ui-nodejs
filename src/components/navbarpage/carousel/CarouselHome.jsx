import { Carousel } from "flowbite-react"

function CarouselHome() {
    return (
        <div className="h-28 sm:h-32 xl:h-36 2xl:h-40">
            <Carousel slideInterval={2000}>
                <img src="https://rukminim1.flixcart.com/fk-p-flap/480/210/image/cae744eea25fde98.jpeg?q=20" alt="Product1" />
                <img src="https://rukminim1.flixcart.com/fk-p-flap/480/210/image/4aad095f9ca5ebd9.jpg?q=20" alt="Product2" />
                <img src="https://rukminim1.flixcart.com/fk-p-flap/480/210/image/9a6168fc495cba89.jpeg?q=20" alt="Product3" />
                <img src="https://rukminim1.flixcart.com/fk-p-flap/480/210/image/1714eddc8e812927.jpeg?q=20" alt="Product4" />
                <img src="https://rukminim1.flixcart.com/fk-p-flap/480/210/image/845d5893ef37c283.jpeg?q=20" alt="Product5" />
            </Carousel>
        </div>
    )
}

export default CarouselHome
