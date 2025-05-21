import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import './css/search.css';

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim() === '') {
            return;
        }
        navigate(`/search/${keyword}`);
    };

    return (
        <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-container">
                    <i className="fa fa-search search-icon"></i>
                    <input
                        type="search"
                        className="search-input"
                        placeholder="Tìm kiếm theo chức danh, kỹ năng hoặc công ty..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />
                </div>
                <button className="search-button" type="submit">Tìm kiếm</button>
            </form>
        </div>
    )
};

export default Search;