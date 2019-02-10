import React from 'react';

import './spinner.css';

// See https://forums.meteor.com/t/any-recommendations-for-a-spinner-to-use-with-react-apps/22510/4
// See https://github.com/lukehaas/css-loaders
export default function Loader() {
  return <div className="loader">Loading...</div>;
}
