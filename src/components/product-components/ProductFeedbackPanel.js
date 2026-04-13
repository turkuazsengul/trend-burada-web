import React, {useState} from 'react';
import {Rating} from 'primereact/rating';

export const ProductFeedbackPanel = ({
    product,
    mode,
    reviews,
    questionAnswers,
    onModeChange
}) => {
    const isReviewMode = mode === 'reviews';
    const [activePhotoModal, setActivePhotoModal] = useState(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    const openPhotoModal = (review) => {
        setActivePhotoModal({user: review.user, photos: review.photos});
        setActivePhotoIndex(0);
    };

    const closePhotoModal = () => {
        setActivePhotoModal(null);
        setActivePhotoIndex(0);
    };

    const showPrevPhoto = () => {
        if (!activePhotoModal?.photos?.length) {
            return;
        }

        setActivePhotoIndex((prev) => {
            const total = activePhotoModal.photos.length;
            return (prev - 1 + total) % total;
        });
    };

    const showNextPhoto = () => {
        if (!activePhotoModal?.photos?.length) {
            return;
        }

        setActivePhotoIndex((prev) => {
            const total = activePhotoModal.photos.length;
            return (prev + 1) % total;
        });
    };

    return (
        <>
            <div className="product-feedback-layout">
                <aside className="product-feedback-media">
                    <img src={product?.img} alt={product?.title || 'Urun gorseli'}/>
                    <div className="product-feedback-media-meta">
                        <strong>{product?.mark}</strong>
                        <span>{product?.title}</span>
                    </div>
                </aside>

                <div className="product-feedback-content">
                    <div className="product-feedback-topbar">
                        <button
                            type="button"
                            className={`product-feedback-tab ${isReviewMode ? 'is-active' : ''}`}
                            onClick={() => onModeChange('reviews')}
                        >
                            Yorumlar ({reviews.length})
                        </button>
                        <button
                            type="button"
                            className={`product-feedback-tab ${!isReviewMode ? 'is-active' : ''}`}
                            onClick={() => onModeChange('qa')}
                        >
                            Soru-Cevap ({questionAnswers.length})
                        </button>
                    </div>

                    {isReviewMode && (
                        <div className="product-feedback-list is-review-scroll">
                            {reviews.map((review) => (
                                <article key={review.id} className="product-feedback-item">
                                    <div className="product-feedback-item-head">
                                        <strong>{review.user}</strong>
                                        <span>{review.date}</span>
                                    </div>
                                    <Rating value={review.rating} readOnly cancel={false}/>
                                    <p>{review.text}</p>

                                    {Array.isArray(review.photos) && review.photos.length > 0 && (
                                        <button
                                            type="button"
                                            className="review-photo-preview"
                                            onClick={() => openPhotoModal(review)}
                                        >
                                            <img src={review.photos[0]} alt={`${review.user} yorum fotografi`}/>
                                        </button>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}

                    {!isReviewMode && (
                        <div className="product-feedback-list">
                            {questionAnswers.map((qa) => (
                                <article key={qa.id} className="product-feedback-item qa-item">
                                    <div className="qa-row">
                                        <span className="qa-badge question">Soru</span>
                                        <p>{qa.question}</p>
                                    </div>
                                    <div className="qa-row">
                                        <span className="qa-badge answer">Cevap</span>
                                        <p>{qa.answer}</p>
                                    </div>
                                    <div className="product-feedback-item-foot">{qa.date}</div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {activePhotoModal && (
                <div className="review-photo-modal-backdrop" onClick={closePhotoModal}>
                    <div className="review-photo-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="review-photo-modal-head">
                            <strong>{activePhotoModal.user} - Fotoğraflar</strong>
                            <button type="button" onClick={closePhotoModal}>
                                <i className="pi pi-times"/>
                            </button>
                        </div>

                        <div className="review-photo-slider">
                            <button type="button" className="review-photo-nav prev" onClick={showPrevPhoto}>
                                <i className="pi pi-angle-left"/>
                            </button>

                            <img
                                src={activePhotoModal.photos[activePhotoIndex]}
                                alt="Yorum fotografi"
                                className="review-photo-active-image"
                            />

                            <button type="button" className="review-photo-nav next" onClick={showNextPhoto}>
                                <i className="pi pi-angle-right"/>
                            </button>
                        </div>

                        <div className="review-photo-counter">
                            {activePhotoIndex + 1} / {activePhotoModal.photos.length}
                        </div>

                        <div className="review-photo-thumbs">
                            {activePhotoModal.photos.map((photo, index) => (
                                <button
                                    key={photo}
                                    type="button"
                                    className={`review-photo-thumb-btn ${activePhotoIndex === index ? 'is-active' : ''}`}
                                    onClick={() => setActivePhotoIndex(index)}
                                >
                                    <img src={photo} alt="Yorum fotografi kucuk onizleme"/>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
