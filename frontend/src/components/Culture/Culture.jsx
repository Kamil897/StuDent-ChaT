import React, { useState } from "react";
import s from "../Society/Society.module.scss";
import { motion, AnimatePresence } from 'framer-motion';
import FlowingMenu from '../FlowingMenu/FlowingMenu.jsx';
import LikeButton from '../../LikeButton/LikeButton';
import Switch from '../../Switch/Switch';
import Share from '../../Share/Share';

const newsData = [
   {
       id: 1,
       title: "Будущее образования в Узбекистане",
       content: "В ноябре 2025 года в Ташкенте прошла первая национальная конференция, посвящённая реформам в сфере образования. На мероприятии обсуждались: Внедрение цифровых учебников и онлайн-платформ. Разработка новых стандартов преподавания. Подготовка учителей к использованию современных технологий в классе. В конференции приняли участие представители Минобразования, частных школ и международные эксперты.",
   }, 
   {
       id: 2,
       title: "Сборы в поддержку образовательных инициатив",
       content: "Группы энтузиастов в социальных сетях, такие как «EduFuture» и «Smart Schools Uzbekistan», запустили кампании по сбору средств для развития школьной инфраструктуры. За последние месяцы были собраны средства на: Покупку интерактивных досок и планшетов для школ в Ташкенте и Бухаре. Проведение курсов повышения квалификации для сельских учителей.",
   },
   {
       id: 3,
       title: "Программы поддержки талантливых учеников",
       content: "Образовательные учреждения регулярно запускают инициативы по поддержке одарённых детей: В Ташкенте прошла ярмарка проектов, где школьники представили более 50 инновационных идей. В Самарканде и Фергане стартовала программа «Учи и вдохновляй», в рамках которой лучшие ученики получают доступ к менторским программам и онлайн-курсам от зарубежных университетов.",
   }
];


const Culture = () => {
  const demoItems = [
    { link: 'https://inha.uz/ru/glavnaya/', text: 'INHA', image: 'https://inha.uz/wp-content/uploads/2021/01/The_panoramic_view_of_IUT-1536x612.jpg' },
  ];

  const [showShareOptions, setShowShareOptions] = useState(false);
  const [like, setLike] = useState(1752);
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const toggleLike = () => {
   if (liked) {
      setLike(like - 1); 
   } else {
      setLike(like + 1); 
   }
   setLiked(!liked); 
};

  const toggleSave = () => setSaved(!saved);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  const shareToSocialMedia = (platform) => {
     const url = encodeURIComponent(window.location.href);
     const text = encodeURIComponent(p);
     const image = encodeURIComponent(ImgSrc);

     let shareUrl = '';

     switch (platform) {
        case 'facebook':
           shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
           break;
        case 'twitter':
           shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
           break;
        case 'whatsapp':
           shareUrl = `https://wa.me/?text=${text} ${url}`;
           break;
        case 'linkedin':
           shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}&summary=${text}`;
           break;
        case 'telegram':
           shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
           break;
        default:
           return;
     }

     window.open(shareUrl, '_blank', 'width=600,height=400');
     setShowShareOptions(false);
  };


  const handleShare = () => {
     if (navigator.share) {
       navigator.share({
         title: 'Новость',
         text: 'Посмотрите эту новость!',
         url: window.location.href,
       });
     } else {
       alert('Функция "Поделиться" не поддерживается.');
     }
   };
   

  return (
    <>
      <div className={s.newsPage}>
        <h1 className={s.title}>Образования - Будущее</h1>
        <div className={s.newsList}>
          {newsData.map((news) => (
            <div key={news.id} className={s.newsItem}>
              <h2 className={s.newsTitle}>{news.title}</h2>
              <p className={s.newsContent}>{news.content}</p>
              <div className={s.likes}>
            
            <LikeButton count={like} onToggle={(state) => {
               setLiked(state);
               setLike(prev => state ? prev + 1 : prev - 1);
            }} />

            
            <Switch active={saved} onToggle={(state) => setSaved(state)} />

            <Share
               active={showShareOptions}
               onToggle={() => setShowShareOptions(prev => !prev)}
               onPlatformSelect={shareToSocialMedia}
            />
         </div>


            <AnimatePresence>
               {showShareOptions && (
                  <motion.div
                     className={s.shareOptions}
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.3 }}
                  >
                     <button onClick={() => shareToSocialMedia('facebook')}>Facebook</button>
                     <button onClick={() => shareToSocialMedia('twitter')}>Twitter</button>
                     <button onClick={() => shareToSocialMedia('whatsapp')}>WhatsApp</button>
                  </motion.div>
               )}
            </AnimatePresence>

            </div>
          ))}
        </div>
      </div>

      
      <div style={{ height: '180px', position: 'relative', marginTop: '50px'}}>
          <FlowingMenu items={demoItems} />
      </div>
    </>
  );
};

export default Culture;
