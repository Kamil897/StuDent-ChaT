import s from './NewsHero.module.scss';
import NewsText from '../NewsText/NewsText';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const newsArray = [
  {
    id: 'society',
    category: 'news.society',
    img: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/BBC_World_News_2022_%28Boxed%29.svg',
    content: 'news.societyText'
  },
  {
    id: 'tech',
    category: 'news.tech',
    img: '/openday.jpg',
    content: 'news.techText1'
  },
  {
    id: 'tech',
    category: 'news.tech',
    img: '/openday.jpg',
    content: 'news.techText2'
  },
  {
    id: 'culture',
    category: 'news.culture',
    img: '/agile.jpg',
    content: 'news.cultureText'
  }
];

const NewsHero = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState({
    allnews: true,
    society: true,
    tech: true,
    culture: true
  });

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSections({
        allnews: true,
        society: true,
        tech: true,
        culture: true
      });
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const newFiltered = {};

    newsArray.forEach(({ id, category, content }) => {
      const match =
        t(category).toLowerCase().includes(searchLower) ||
        t(content).toLowerCase().includes(searchLower);
      newFiltered[id] = true;
    });

    setFilteredSections(newFiltered);
  }, [searchTerm, t]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={s.newspage}>
      <div className={s.searchSection} style={{ margin: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder={t('news.search')}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '25px',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
            onBlur={(e) => (e.target.style.borderColor = '#ddd')}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>
          )}
        </div>
        {searchTerm && (
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            {t('news.searchResults')}: "<strong>{searchTerm}</strong>"
          </div>
        )}
      </div>

      <div className={`${s.h1} ${s.df}`}>
        <h1 className={s.Text} id="allnews">{t('news.all')}</h1>
        <div className={s.nav}>
          <a href="#society">{t('news.society')}</a>
          <a href="#tech">{t('news.tech')}</a>
          <a href="#culture">{t('news.culture')}</a>
        </div>
      </div>

      {newsArray.map(({ id, category, img, content }, index) => (
        filteredSections[id] && (
          <div key={id + index}>
            <div className={s.h1}>
              <h1 className={s.Text} id={id}>{t(category)}</h1>
            </div>
            <div className={s.new}>
              <NewsText ImgSrc={img} p={t(content)} />
            </div>
          </div>
        )
      ))}

      {searchTerm && !Object.values(filteredSections).some(Boolean) && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h3>{t('news.notFound')}</h3>
          <p>{t('news.tryAnother')}</p>
        </div>
      )}
    </div>
  );
};

export default NewsHero;
