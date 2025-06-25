import React, { useState } from "react";
import s from "../Society/Society.module.scss";
import { motion, AnimatePresence } from 'framer-motion';
import FlowingMenu from '../FlowingMenu/FlowingMenu.jsx';
import LikeButton from '../../LikeButton/LikeButton';
import Switch from '../../Switch/Switch';
import Share from '../../Share/Share';

const educationNewsData = [
  {
      id: 1,
      title: "Проблемы системы образования в Узбекистане",
      content:
          "Система образования в Узбекистане сталкивается с рядом серьёзных вызовов. Несмотря на реформы, многие школы и вузы испытывают нехватку ресурсов. Основные проблемы включают: Недостаток квалифицированных кадров. В некоторых регионах ощущается дефицит опытных учителей, особенно по естественнонаучным дисциплинам. Устаревшие учебные программы. Учебные материалы и методики не всегда соответствуют современным требованиям и мировым стандартам. Неравный доступ к образованию. В сельских районах учащиеся имеют ограниченный доступ к качественному образованию, по сравнению с городскими школами.",
  },
  {
      id: 2,
      title: "Текущая ситуация в школах и вузах",
      content:
          "Сегодня образовательные учреждения страны стараются адаптироваться к новым требованиям, однако многие изменения происходят медленно. Вот некоторые аспекты текущей ситуации: Цифровизация образования. Внедрение электронных дневников, онлайн-обучения и платформ для самостоятельной работы студентов. ВУЗы переходят на кредитно-модульную систему. Это способствует большей гибкости в обучении, но требует от преподавателей новых подходов. Волонтёрские и частные инициативы. В стране появляются частные образовательные центры и курсы, помогающие восполнить пробелы в школьном и вузовском образовании.",
  },
  {
      id: 3,
      title: "С какими трудностями сталкивается система образования",
      content:
          "Несмотря на положительные шаги, сфера образования сталкивается с рядом серьёзных препятствий: Недофинансирование. Многие школы не имеют достаточного бюджета для обновления оборудования и обеспечения учебных материалов. Перегрузка учащихся. Программа часто слишком насыщена, что создаёт стресс и снижает мотивацию к обучению. Слабая практическая подготовка. Вузы готовят теоретически подкованных специалистов, но слабо ориентируют их на реальные условия рынка труда. Отсутствие постоянного повышения квалификации для преподавателей. Это приводит к отставанию от современных педагогических методик.",
  },
];


const Tech = () => {
  const demoItems = [
    { link: 'https://uzb.mgimo.ru/contacts', text: 'MGIMO', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvLpGgo5KSTAxe95PLSdASTX3TWpYPWWehYw&s' },
  ];

   const [showShareOptions, setShowShareOptions] = useState(false);
   const [like, setLike] = useState(1752);
   const [liked, setLiked] = useState(false);
   const [saved, setSaved] = useState(false);

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
        <h1 className={s.title}>Образования - Проблемы</h1>
        <div className={s.newsList}>
          {educationNewsData.map((news) => (
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

export default Tech;
