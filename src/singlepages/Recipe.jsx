import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Seo from '../components/Seo';
const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const RecipeCategories = ({ recipe }) => {
  const [taxonomies, setTaxonomies] = useState([]);

  useEffect(() => {
    if (!recipe) {
      return;
    }

    const taxonomyEndpoint = recipe._links['wp:term'][0].href;

    axios.get(`${taxonomyEndpoint}`)
      .then((res) => {
        setTaxonomies(res.data);
      })
      .catch((err) => console.log(err));

  }, [recipe]);

  const renderedTaxonomies = taxonomies.map((taxonomy, index) => {
    return (
      <span key={taxonomy.id} className='taxonomy-term-pill'>
        {taxonomy.name}
        {index < taxonomies.length - 1 && <span> </span>}
      </span>
    );
  });

  return (
    <div>
      {renderedTaxonomies}
    </div>
  );
};

const Recipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const endpoint = `${baseURL}/recipes/${id}?_embed`;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${endpoint}`)
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [endpoint]);

  // Featured image check
  function getFeaturedImage(recipe) {
    if (recipe && recipe._embedded && recipe._embedded['wp:featuredmedia'] && recipe._embedded['wp:featuredmedia'][0].source_url) {
      return recipe._embedded['wp:featuredmedia'][0].source_url;
    } else {
      return 'https://via.placeholder.com/150';
    }
  }

  if (loading) {
    return <>  
        <div className='loading-container'>
          <img src="../logo-only.png" alt="Loading" className='loading-logo' />
        </div> 
      </>;
  }

  return (
    <>
      <Seo
        title={recipe.yoast_head_json?.title || post.title.rendered}
        description={recipe.yoast_head_json?.description}
        image={recipe.yoast_head_json?.og_image?.[0]?.url}
      />
    <button onClick={() => navigate(-1)} className="back-button primary-button">
        &larr; Back
      </button>
      <div key={recipe.slug} className="single-container">
      <img src={getFeaturedImage(recipe)} alt="Featured Recipe" className='single-img'/>
        <h4 className="single-title">{recipe.title.rendered}</h4>
        <RecipeCategories recipe={recipe} />
        <p className='nutrition'><strong>{recipe.acf.nutrition}</strong></p>
        <div className='single-body'dangerouslySetInnerHTML={{ __html: recipe.content.rendered }} />
      </div>
    </>
  );
};

export default Recipe;
