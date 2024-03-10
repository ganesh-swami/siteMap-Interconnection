// sections
import PropTypes from 'prop-types';
import TopicalView from 'src/sections/topical/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: One',
};

const Page=({params})=> {
    const { id } = params;
  return <TopicalView id={id}/>;
}

Page.propTypes = {
  params: PropTypes.object,
};
export default Page;