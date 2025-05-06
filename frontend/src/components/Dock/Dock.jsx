import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const Dock = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('loggedInUsername');
    navigate('/login');
  };

  return (
    <StyledWrapper>
      <div className="card">
        <ul className="list">
          <Link to={'/edit'}>
            <li className="element">
              <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="#7e8590" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
              <p className="label">Изменить</p>
            </li>
          </Link>
          <Link to={'/'}>
            <li className="element">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              <p className="label">Домой</p>
            </li>
          </Link>
        </ul>
        <div className="separator" />
        <ul className="list">
        
          <Link to={'/Games'}>
            <li className="element">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="lucide lucide-gamepad2-icon lucide-gamepad-2"><line x1="6"  x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01"  y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0  0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5   2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0   3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
              <p className="label">Игры</p>
            </li>
          </Link>

          <li className="element delete" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="M9 21H5a2   2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9"   y1="12" y2="12"/></svg>
            <p className="label">Выйти</p>
          </li>
        </ul>

        <div className="separator" />

        <ul className="list">
          <Link to={'/Shop'}>
            <li className="element">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"   stroke-linejoin="round" class="lucide lucide-shopping-cart-icon    lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <p className="label">Магазин</p>
            </li>
          </Link>
        </ul>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 300px;
    /* background-color: rgba(36, 40, 50, 1);
  background-image: linear-gradient(135deg, rgba(36, 40, 50, 1) 0%, rgba(36, 40, 50, 1) 40%, rgba(37, 28, 40, 1) 100%); */

    background-color: rgba(36, 40, 50, 1);
    background-image: linear-gradient(
      139deg,
      rgba(36, 40, 50, 1) 0%,
      rgba(36, 40, 50, 1) 0%,
      rgba(37, 28, 40, 1) 100%
    );

    border-radius: 10px;
    padding: 26px 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card .separator {
    border-top: 1.5px solid #42434a;
  }

  .card .list {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0px 10px;
  }

  .card .list .element {
    display: flex;
    align-items: center;
    color: #7e8590;
    gap: 10px;
    transition: all 0.3s ease-out;
    padding: 4px 7px;
    border-radius: 6px;
    cursor: pointer;
  }

  .card .list .element svg {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease-out;
  }

  .card .list .element .label {
    font-weight: 600;
    font-size: 22px;
  }

  .card .list .element:hover {
    background-color: #5353ff;
    color: #ffffff;
    transform: translate(1px, -1px);
  }
  .card .list .delete:hover {
    background-color: #8e2a2a;
  }

  .card .list .element:active {
    transform: scale(0.99);
  }

  .card .list:not(:last-child) .element:hover svg {
    stroke: #ffffff;
  }

  .card .list:last-child svg {
    stroke: #bd89ff;
  }
  .card .list:last-child .element {
    color: #bd89ff;
  }

  .card .list:last-child .element:hover {
    background-color: rgba(56, 45, 71, 0.836);
  }`;

export default Dock;
