import { useState, useEffect } from 'react';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo'

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const Recipes = () => {

  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');

  const endpoint = `${baseURL}/recipes?_embed`;

  useEffect(() => {
    axios.get(endpoint)
      .then((res) => {
        const fetchedRecipes = res.data;
        setRecipes(fetchedRecipes);
        setFilteredRecipes(fetchedRecipes);

        const uniqueTerms = new Set();
        fetchedRecipes.forEach(recipe => {
          recipe._embedded['wp:term'][0].forEach(term => uniqueTerms.add(term.name));
        });
        setTerms([...uniqueTerms]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleTermChange = (event) => {
    const term = event.target.value;
    setSelectedTerm(term);
    if (term) {
      const filtered = recipes.filter(recipe =>
        recipe._embedded['wp:term'][0].some(t => t.name === term)
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  };

  const RecipeList = ({ recipes }) => {
    const mappedRecipes = recipes.map((recipe, index) => {
      function getFeaturedImage(recipe) {
        if (
          recipe &&
          recipe._embedded &&
          recipe._embedded["wp:featuredmedia"] &&
          recipe._embedded["wp:featuredmedia"][0].source_url
        ) {
          return recipe._embedded["wp:featuredmedia"][0].source_url;
        } else {
          return "https://via.placeholder.com/150";
        }
      }

      const termNames = recipe._embedded['wp:term'][0].map(term => `<span class='categories'>${term.name}</span>`).join(' ');

      return (
        <div key={recipe.slug + "-" + index} className="post-container">
          <img src={getFeaturedImage(recipe)} alt={recipe.title.rendered} className='post-img' />
          <h4 className='title'>{recipe.title.rendered}</h4>
          <div className='terms' dangerouslySetInnerHTML={{__html: termNames}}/> 
          <a className='primary-button' href={`#/recipes/${recipe.id}`}>Read More</a>
          <p className='date'>
            Created&nbsp;
            {formatDistanceToNow(new Date(recipe.date), {
              includeSeconds: true,
            })}{' '}
            ago
          </p>
        </div>
      );
    });

    return <>{mappedRecipes}</>;
  };

  return (
    <>
      <Seo
        title='Recipes - Diabetes NZ'
        description='Discover a variety of delicious, diabetes-friendly recipes designed by Diabetes NZ. Find healthy meals, snacks, and desserts that help manage blood sugar levels while keeping flavor in every bite. Perfect for those living with diabetes and anyone looking to eat well.'
        url={window.location.href}
      />
      <PageHeader title="RECIPES" image_url="/header-imgs/recipes.jpg" />
      
      <div className='page-container'>
        {loading ? (
          <div className='loading-container'>
            <img src="../logo-only.png" alt="Loading" className='loading-logo' />
          </div>
        ) : (
          <>
            <div className='filter-container'>
              <select value={selectedTerm} onChange={handleTermChange}>
                <option value=''>All Categories</option>
                {terms.map((term, index) => (
                  <option key={index} value={term}>{term}</option>
                ))}
              </select>
            </div>
            <div className='page-grid'>
              <RecipeList recipes={filteredRecipes} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Recipes;
