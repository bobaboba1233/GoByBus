import React, { useState } from 'react';
import { FaHeadset, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import '../styles/Support.css';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Здесь будет запрос к API
    console.log('Отправка данных:', formData);
    
    // Имитация запроса
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      message: '',
      subject: 'general'
    });
    
    // Сброс статуса отправки через 5 сек
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <div className="support-header">
          <FaHeadset className="support-icon" />
          <h1>Служба поддержки</h1>
          <p>Мы всегда готовы помочь вам с любыми вопросами</p>
        </div>

        <div className="support-content">
          <div className="contact-methods">
            <div className="contact-card">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <h3>Электронная почта</h3>
              <p>support@gobybus.com</p>
              <p>Отвечаем в течение 24 часов</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <h3>Телефон</h3>
              <p>8 (800) 123-45-67</p>
              <p>Ежедневно с 8:00 до 20:00</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Офис</h3>
              <p>г. Казань, ул. Серова, 15</p>
              <p>Пн-Пт с 10:00 до 18:00</p>
            </div>
          </div>

          <div className="support-form-container">
            <h2>Форма обратной связи</h2>
            {isSubmitted ? (
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <h3>Ваше сообщение отправлено!</h3>
                <p>Наш специалист свяжется с вами в ближайшее время</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="support-form">
                <div className="form-group">
                  <label htmlFor="name">Ваше имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Электронная почта</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@mail.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Тема обращения</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">Общий вопрос</option>
                    <option value="booking">Проблемы с бронированием</option>
                    <option value="payment">Проблемы с оплатой</option>
                    <option value="refund">Возврат билета</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Ваше сообщение</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Опишите вашу проблему или вопрос..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Отправка...' : (
                    <>
                      <FaPaperPlane /> Отправить сообщение
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="faq-section">
          <h2>Часто задаваемые вопросы</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Как отменить бронирование?</h3>
              <p>Вы можете отменить бронирование в личном кабинете или связавшись с нашей службой поддержки.</p>
            </div>
            <div className="faq-item">
              <h3>Какие способы оплаты доступны?</h3>
              <p>Мы принимаем банковские карты Visa, Mastercard, МИР, а также электронные кошельки.</p>
            </div>
            <div className="faq-item">
              <h3>Нужно ли распечатывать билет?</h3>
              <p>Нет, достаточно показать электронный билет на экране вашего устройства.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;