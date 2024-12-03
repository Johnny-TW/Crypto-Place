import DashBoard_Detail from '../images/svg/dashboard-detail.svg';
import All_DataDashboard from '../images/svg/all-data-dashboard.svg';

// Image card
export const CORE_CONCEPTS = [
  {
    image: DashBoard_Detail,
    title: 'NFT Dashboard',
    link: '/NFTDashboard',
    description:
      'Create New simulation request.',
  },
  {
    image: All_DataDashboard,
    title: 'All Data Dashboard',
    link: '/NFTDashboard',
    description:
      'List relevant results by important index.',
  },
];

// Tab content
export const EXAMPLES = {
  components: {
    title: 'Dashboard',
    description:
      'Components are the building blocks of React applications. A component is a self-contained module (HTML + optional CSS + JS) that renders some output.',
    code: `
    function Welcome() {
      return <h1>Hello, World!</h1>;
    }`,
  },
  jsx: {
    title: 'JSX',
    description:
      'JSX is a syntax extension to JavaScript. It is similar to a template language, but it has full power of JavaScript (e.g., it may output dynamic content).',
    code: `
    <div>
      <h1>Welcome {userName}</h1>
      <p>Time to learn React!</p>
    </div>`,
  },
  props: {
    title: 'Props',
    description:
      'Components accept arbitrary inputs called props. They are like function arguments.',
    code: `
    function Welcome(props) {
      return <h1>Hello, {props.name}</h1>;
    }`,
  },
  state: {
    title: 'State',
    description:
      'State allows React components to change their output over time in response to user actions, network responses, and anything else.',
    code: `
    function Counter() {
      const [isVisible, setIsVisible] = useState(false);
      function handleClick() {
        setIsVisible(true);
      }
      return (
        <div>
          <button onClick={handleClick}>Show Details</button>
          {isVisible && <p>Amazing details!</p>}
        </div>
      );
    }`,
  },
};