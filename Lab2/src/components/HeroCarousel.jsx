import Carousel from "react-bootstrap/Carousel";

export default function HeroCarousel({ slides }) {
  return (
    <section className="hero-carousel" aria-label="Featured orchids">
      <Carousel
        fade
        controls={false}
        indicators
        interval={2600}
        ride="carousel"
        pause={false}
        touch
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img className="hero-carousel-img" src={slide.image} alt={slide.title} />
            <Carousel.Caption className="hero-carousel-caption">
              <span className="hero-kicker">Orchid Shop</span>
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}
