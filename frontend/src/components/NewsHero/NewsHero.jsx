import s from './NewsHero.module.scss';
import NewsText from '../NewsText/NewsText';
import FlowingMenu from '../FlowingMenu/FlowingMenu.jsx';
import { useState, useEffect } from 'react';

const NewsHero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState({
    allnews: true,
    society: true,
    tech: true,
    culture: true
  });

  const demoItems = [
    { link: 'https://www.mdis.uz/ru/menu/mdis', text: 'MDIS', image: 'https://avatars.mds.yandex.net/get-altay/1545421/2a0000016ee1c1e28b977f7822641eb1c14a/L_height' },
  ];

  const newsContent = {
    allnews: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi natus, numquam consectetur amet iste architecto repellat excepturi mollitia libero nam aperiam fugit, sunt itaque repudiandae dicta maiores tempora harum maxime. Quidem debitis quibusdam id iure cupiditate. Esse sit iure reiciendis? Illo veniam autem maiores! Nesciunt quas ipsa ullam consectetur tenetur, reprehenderit voluptates omnis, aspernatur aperiam numquam ut provident quis at sed officiis enim voluptate veritatis facilis asperiores recusandae blanditiis debitis repellendus. Nisi, commodi necessitatibus! Tempora ipsum vero labore. Pariatur, fugit at ducimus officiis repellat cum error, iste veniam vitae similique deleniti ipsum reiciendis, libero mollitia harum nobis doloremque recusandae aliquid! Voluptates neque, obcaecati ducimus praesentium alias numquam omnis, mollitia provident labore magnam doloribus beatae! Suscipit odit nisi officiis tenetur laudantium accusantium, quaerat soluta rem animi provident. Quas nulla debitis dolor nostrum dolorem. Ipsa veniam tenetur neque quas natus perspiciatis enim ipsum nemo voluptates? Modi tenetur ullam labore nobis quas. Explicabo pariatur praesentium atque doloremque quibusdam et dolores nisi consectetur fuga. Inventore natus, illum consequatur laboriosam, praesentium omnis provident excepturi ea alias tempore perspiciatis et cum velit. Modi a dignissimos odit ad numquam sapiente aperiam assumenda deleniti hic quas pariatur quasi explicabo perferendis accusamus perspiciatis, quo rerum aliquid dolorum eius expedita molestias asperiores possimus fuga. Nemo doloremque enim voluptatibus consectetur modi? Ducimus necessitatibus veritatis laboriosam, sapiente cum aut assumenda, dolorum est natus ipsam maxime, unde odit pariatur libero? Distinctio labore nihil minus, amet iste explicabo in illo, dolorem fugit ad nisi voluptate! Excepturi nemo accusamus ipsum officiis voluptate eveniet necessitatibus, unde mollitia, quibusdam ab aspernatur? Illum sunt rem est. Maiores quidem asperiores expedita ducimus officia dignissimos nihil reiciendis nisi dolor fuga vero sed quia, minima natus non corporis consequuntur perspiciatis iusto praesentium! Voluptatem explicabo ipsa deleniti ullam corporis dolor, ut distinctio voluptatibus ipsum sed molestiae! Asperiores atque cumque non beatae numquam?",
    society: "Lorem ipsum dolor sit amet consectetur adipisicing elit. nigger Eligendi natus, numquam consectetur amet iste architecto repellat excepturi mollitia libero nam aperiam fugit, sunt itaque repudiandae dicta maiores tempora harum maxime. Quidem debitis quibusdam id iure cupiditate. Esse sit iure reiciendis? Illo veniam autem maiores! Nesciunt quas ipsa ullam consectetur tenetur, reprehenderit voluptates omnis, aspernatur aperiam numquam ut provident quis at sed officiis enim voluptate veritatis facilis asperiores recusandae blanditiis debitis repellendus. Nisi, commodi necessitatibus! Tempora ipsum vero labore. Pariatur, fugit at ducimus officiis repellat cum error, iste veniam vitae similique deleniti ipsum reiciendis, libero mollitia harum nobis doloremque recusandae aliquid! Voluptates neque, obcaecati ducimus praesentium alias numquam omnis, mollitia provident labore magnam doloribus beatae! Suscipit odit nisi officiis tenetur laudantium accusantium, quaerat soluta rem animi provident. Quas nulla debitis dolor nostrum dolorem. Ipsa veniam tenetur neque quas natus perspiciatis enim ipsum nemo voluptates? Modi tenetur ullam labore nobis quas. Explicabo pariatur praesentium atque doloremque quibusdam et dolores nisi consectetur fuga. Inventore natus, illum consequatur laboriosam, praesentium omnis provident excepturi ea alias tempore perspiciatis et cum velit. Modi a dignissimos odit ad numquam sapiente aperiam assumenda deleniti hic quas pariatur quasi explicabo perferendis accusamus perspiciatis, quo rerum aliquid dolorum eius expedita molestias asperiores possimus fuga. Nemo doloremque enim voluptatibus consectetur modi? Ducimus necessitatibus veritatis laboriosam, sapiente cum aut assumenda, dolorum est natus ipsam maxime, unde odit pariatur libero? Distinctio labore nihil minus, amet iste explicabo in illo, dolorem fugit ad nisi voluptate! Excepturi nemo accusamus ipsum officiis voluptate eveniet necessitatibus, unde mollitia, quibusdam ab aspernatur? Illum sunt rem est. Maiores quidem asperiores expedita ducimus officia dignissimos nihil reiciendis nisi dolor fuga vero sed quia, minima natus non corporis consequuntur perspiciatis iusto praesentium! Voluptatem explicabo ipsa deleniti ullam corporis dolor, ut distinctio voluptatibus ipsum sed molestiae! Asperiores atque cumque non beatae numquam?",
    tech: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi natus, numquam consectetur amet iste architecto repellat excepturi mollitia libero nam aperiam fugit, sunt itaque repudiandae dicta maiores tempora harum maxime. Quidem debitis quibusdam id iure cupiditate. Esse sit iure reiciendis? Illo veniam autem maiores! Nesciunt quas ipsa ullam consectetur tenetur, reprehenderit voluptates omnis, aspernatur aperiam numquam ut provident quis at sed officiis enim voluptate veritatis facilis asperiores recusandae blanditiis debitis repellendus. Nisi, commodi necessitatibus! Tempora ipsum vero labore. Pariatur, fugit at ducimus officiis repellat cum error, iste veniam vitae similique deleniti ipsum reiciendis, libero mollitia harum nobis doloremque recusandae aliquid! Voluptates neque, obcaecati ducimus praesentium alias numquam omnis, mollitia provident labore magnam doloribus beatae! Suscipit odit nisi officiis tenetur laudantium accusantium, quaerat soluta rem animi provident. Quas nulla debitis dolor nostrum dolorem. Ipsa veniam tenetur neque quas natus perspiciatis enim ipsum nemo voluptates? Modi tenetur ullam labore nobis quas. Explicabo pariatur praesentium atque doloremque quibusdam et dolores nisi consectetur fuga. Inventore natus, illum consequatur laboriosam, praesentium omnis provident excepturi ea alias tempore perspiciatis et cum velit. Modi a dignissimos odit ad numquam sapiente aperiam assumenda deleniti hic quas pariatur quasi explicabo perferendis accusamus perspiciatis, quo rerum aliquid dolorum eius expedita molestias asperiores possimus fuga. Nemo doloremque enim voluptatibus consectetur modi? Ducimus necessitatibus veritatis laboriosam, sapiente cum aut assumenda, dolorum est natus ipsam maxime, unde odit pariatur libero? Distinctio labore nihil minus, amet iste explicabo in illo, dolorem fugit ad nisi voluptate! Excepturi nemo accusamus ipsum officiis voluptate eveniet necessitatibus, unde mollitia, quibusdam ab aspernatur? Illum sunt rem est. Maiores quidem asperiores expedita ducimus officia dignissimos nihil reiciendis nisi dolor fuga vero sed quia, minima natus non corporis consequuntur perspiciatis iusto praesentium! Voluptatem explicabo ipsa deleniti ullam corporis dolor, ut distinctio voluptatibus ipsum sed molestiae! Asperiores atque cumque non beatae numquam?",
    culture: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi natus, numquam consectetur amet iste architecto repellat excepturi mollitia libero nam aperiam fugit, sunt itaque repudiandae dicta maiores tempora harum maxime. Quidem debitis quibusdam id iure cupiditate. Esse sit iure reiciendis? Illo veniam autem maiores! Nesciunt quas ipsa ullam consectetur tenetur, reprehenderit voluptates omnis, aspernatur aperiam numquam ut provident quis at sed officiis enim voluptate veritatis facilis asperiores recusandae blanditiis debitis repellendus. Nisi, commodi necessitatibus! Tempora ipsum vero labore. Pariatur, fugit at ducimus officiis repellat cum error, iste veniam vitae similique deleniti ipsum reiciendis, libero mollitia harum nobis doloremque recusandae aliquid! Voluptates neque, obcaecati ducimus praesentium alias numquam omnis, mollitia provident labore magnam doloribus beatae! Suscipit odit nisi officiis tenetur laudantium accusantium, quaerat soluta rem animi provident. Quas nulla debitis dolor nostrum dolorem. Ipsa veniam tenetur neque quas natus perspiciatis enim ipsum nemo voluptates? Modi tenetur ullam labore nobis quas. Explicabo pariatur praesentium atque doloremque quibusdam et dolores nisi consectetur fuga. Inventore natus, illum consequatur laboriosam, praesentium omnis provident excepturi ea alias tempore perspiciatis et cum velit. Modi a dignissimos odit ad numquam sapiente aperiam assumenda deleniti hic quas pariatur quasi explicabo perferendis accusamus perspiciatis, quo rerum aliquid dolorum eius expedita..."
  };

  const sectionTitles = {
    allnews: 'Все новости',
    society: 'Общество',
    tech: 'Технологии',
    culture: 'Культура'
  };

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
    const newFilteredSections = {};

    Object.keys(newsContent).forEach(section => {
      const titleMatch = sectionTitles[section].toLowerCase().includes(searchLower);
      const contentMatch = newsContent[section].toLowerCase().includes(searchLower);
      newFilteredSections[section] = titleMatch || contentMatch;
    });

    setFilteredSections(newFilteredSections);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    
    <div className={s.newspage}>


        <div className={s.searchSection} style={{margin: '2rem'}}>
          <div style={{position: 'relative', maxWidth: '600px', margin: '0 auto'}}>
            <input
              type="text"
              placeholder="Поиск новостей..."
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
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
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
            <div style={{textAlign: 'center', marginTop: '10px', color: '#666'}}>
              Результаты поиска для: "<strong>{searchTerm}</strong>"
            </div>
          )}
        </div>

        {filteredSections.allnews && (
          <>
            <div className={`${s.h1} ${s.df} `}>
              <h1 className={s.Text} id='allnews'>Все новости</h1>

              <div className={s.nav}>
                <a href="#society">Общество</a>
                <a href="#tech">Технологии</a>
                <a href="#culture">Культура</a>
              </div>
            </div>

            <div className={s.new}>
                <NewsText ImgSrc={"https://upload.wikimedia.org/wikipedia/commons/e/ea/BBC_World_News_2022_%28Boxed%29.svg"} p={newsContent.allnews} />
            </div>
          </>
        )}

        {filteredSections.society && (
          <>
            <div className={s.h1}>
              <h1 className={s.Text} id='society'>Общество</h1>
            </div>
            
            <div className={s.new}>
              <NewsText ImgSrc={"https://upload.wikimedia.org/wikipedia/commons/e/ea/BBC_World_News_2022_%28Boxed%29.svg"} p={newsContent.society} />
            </div>
          </>
        )}

        {filteredSections.tech && (
          <>
            <div className={s.h1}>
              <h1 className={s.Text} id='tech'>Технологии</h1>
            </div>
            
            <div className={s.new}>
              <NewsText ImgSrc={"https://upload.wikimedia.org/wikipedia/commons/e/ea/BBC_World_News_2022_%28Boxed%29.svg"} p={newsContent.tech} />
            </div>
          </>
        )}

        {filteredSections.culture && (
          <>
            <div className={s.h1}>
              <h1 className={s.Text} id='culture'>Культура</h1>
            </div>

            <div className={s.new}>
              <NewsText ImgSrc={"https://upload.wikimedia.org/wikipedia/commons/e/ea/BBC_World_News_2022_%28Boxed%29.svg"} p={newsContent.culture} />
            </div>
          </>
        )}

        {searchTerm && !Object.values(filteredSections).some(Boolean) && (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            <h3>Результаты не найдены</h3>
            <p>Попробуйте изменить поисковый запрос</p>
          </div>
        )}

    </div>
    
  );
};

export default NewsHero;