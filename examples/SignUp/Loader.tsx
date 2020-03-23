import React from 'react';

import './spinner.css';

// https://forums.meteor.com/t/any-recommendations-for-a-spinner-to-use-with-react-apps/22510/4
// https://github.com/lukehaas/css-loaders
export function Loader() {
  return <div className="loader">Loading...</div>;
}
