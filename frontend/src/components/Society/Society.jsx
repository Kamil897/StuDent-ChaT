import React, { useState } from "react";
import s from "./Society.module.scss";
import { motion, AnimatePresence } from 'framer-motion';
import FlowingMenu from '../FlowingMenu/FlowingMenu.jsx';
import LikeButton from '../../LikeButton/LikeButton';
import Switch from '../../Switch/Switch';
import Share from '../../Share/Share';

const educationData = [
  {
    id: 1,
    title: "Открытие новых учебных центров в регионах",
    content:
      "Согласно последним сообщениям, в рамках программы по улучшению качества образования в 2024 году было объявлено о создании новых учебных центров в каждом регионе Узбекистана. Первые такие центры уже начали свою работу в Ташкенте, Самарканде и Ферганской области. Эти учреждения предоставляют дополнительные занятия по математике, языкам и IT-направлениям. В Ташкенте открылся первый муниципальный образовательный центр, финансируемый из городского бюджета. Он рассчитан на обучение до 500 школьников одновременно.",
  },
  {
    id: 2,
    title: "Волонтёрские образовательные проекты набирают обороты",
    content:
      "Частные инициативы, организованные волонтёрами, продолжают активно развиваться. Образовательный проект «Илим» (Ташкент): за последний год увеличил охват учащихся в два раза. Волонтёры сообщили, что с начала года провели бесплатные занятия для более чем 200 детей. Проект «Знание — сила» (Самарканд): организовал первую благотворительную акцию, в ходе которой собрали учебные материалы и технику на сумму более 10 млн сумов.",
  },
  {
    id: 3,
    title: "Программа «Построй школу для будущего»",
    content:
      "В конце 2024 года была запущена инициатива «Построй школу для будущего», которая позволяет жителям Узбекистана участвовать в строительстве и оснащении новых школ. Граждане могут вносить пожертвования, которые идут на строительство классов, покупку лабораторного оборудования и создание комфортных условий для обучения детей.",
  },
];



const Society = ( ImgSrc, onShare ) => {
  const demoItems = [
    { link: 'https://wiut.uz/', text: 'WestMinister', image: 'https://www.gazeta.uz/media/img/2018/07/BFudA815330117401691_b.jpg' },
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
        <h1 className={s.title}>Образовании - Решение</h1>
        <div className={s.newsList}>
          {educationData.map((news) => (
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

export default Society;
