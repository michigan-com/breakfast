'use strict';

import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

class GalleryImage extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      height: 0,
      width: 0,
    };
  }

  componentDidMount() {
    const { url } = this.props;
    const i = new Image();
    i.onload = () => {
      this.setState({ loaded: true, height: i.height, width: i.width });
    };
    i.src = url;
  }

  render() {
    const { loaded, height, width } = this.state;
    const { url } = this.props;
    const imgStyle = {
      opacity: loaded ? 1 : 0,
    };

    const containerWidth = window.innerWidth < 768 ? 100 : 30;
    const containerStyle = {
      width: `${containerWidth}vw`,
    };

    if (height !== 0 && width !== 0) {
      containerStyle.height = `${containerWidth * (height / width)}vw`;
    }

    return (
      <div className="gallery-image-container" style={containerStyle}>
        <img src={url} alt={url} style={imgStyle} />
      </div>
    );
  }
}

class Gallery extends Component {
  static propTypes = {
    scoreImages: PropTypes.array,
    quoteImages: PropTypes.array,
    listImages: PropTypes.array,
    brandingImages: PropTypes.array,
    infoImages: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeSectionIndex: 0,
    };

    this.getSections = this.getSections.bind(this);
    window.onresize = () => { this.setState({ resize: true }); };
  }

  getSections() {
    const { scoreImages, quoteImages, listImages, brandingImages, infoImages } = this.props;

    return [{
      title: 'Branding',
      explainer: 'Simple branding of the best images your photo team has to offer',
      images: brandingImages,
    }, {
      title: 'Quotes',
      explainer: 'Enhance your social media posts with quotes',
      images: quoteImages,
    }, {
      title: 'Sports Scores',
      explainer: 'Show scores from your area\'s teams (professional and college)',
      images: scoreImages,
    }, {
      title: 'Lists',
      explainer: 'Inform your audience on current events using lists',
      images: listImages,
    }, {
      title: 'Info and Headlines',
      explainer: 'Include headlines and other information in your social media images',
      images: infoImages,
    }];
  }

  setActiveTab(activeSectionIndex) {
    return () => { this.setState({ activeSectionIndex }); };
  }

  renderTabs() {
    const sections = this.getSections();
    const { activeSectionIndex } = this.state;

    const sectionTabs = sections.map((sectionType, index) => {
      const className = ['section-tab'];
      if (index === activeSectionIndex) className.push('active');
      return (
        <div className="tab-container" key={`section-tab-${index}`}>
          <div
            className={className.join(' ')}
            onClick={this.setActiveTab(index)}

          >
            {sectionType.title}
          </div>
        </div>
      );
    });

    return (
      <div className="section-tab-container">
        {sectionTabs}
      </div>
    );
  }

  renderActiveSection() {
    const { activeSectionIndex } = this.state;
    const sections = this.getSections();
    if (activeSectionIndex < 0 || activeSectionIndex >= sections.length) return null;

    const activeSection = sections[activeSectionIndex];
    return (
      <div className="gallery-section">
        <p className="section-explainer">
          {activeSection.explainer}
        </p>
        <div className="section-images-container">
          {activeSection.images.map((img, index) => (
            <GalleryImage url={img} key={`${activeSection.title}-image-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="gallery-container">
        <div className="zebra">
          <p>See examples of headlines paired with our fantastic photography.</p>
        </div>
        {this.renderTabs()}
        {this.renderActiveSection()}
      </div>
    );
  }

}

const SCORE_IMAGES = [
  'https://michigan-breakfast.s3.amazonaws.com/173dbbcf-6252-4990-a93c-a295faef1d22.png',
  'https://michigan-breakfast.s3.amazonaws.com/222c3e5f-f516-44de-9a22-671ebeaff0af.png',
  // 'https://michigan-breakfast.s3.amazonaws.com/11b5ae75-5e4f-464e-8283-1d30a4b76c9c.png',
  'https://michigan-breakfast.s3.amazonaws.com/0452d894-159d-4725-85fc-218ed5fe6603.png',
];

const QUOTE_IMAGES = [
  'https://michigan-breakfast.s3.amazonaws.com/1091f5f5-7a3d-4988-8b1e-e9bb55fb4bf0.png',
  'https://michigan-breakfast.s3.amazonaws.com/0847856f-9248-41b8-82aa-352cecb99bf2.png',
  'https://michigan-breakfast.s3.amazonaws.com/0fca8b5c-2494-4e3f-ba47-4ed0046f2e01.png',
  'https://michigan-breakfast.s3.amazonaws.com/26cc20c8-17ad-4afd-82d1-279b421492b4.png',
  'https://michigan-breakfast.s3.amazonaws.com/245c601b-1400-4d3f-a54e-4e879615c6b6.png',
  'https://michigan-breakfast.s3.amazonaws.com/2a9029f1-f26b-403d-9dc5-78532a259730.png',
  'https://michigan-breakfast.s3.amazonaws.com/0e6b8382-e3f4-4ea9-b37b-6bf6cdd77953.png',
  'https://michigan-breakfast.s3.amazonaws.com/07ccaab7-0164-4d67-9149-184ae7e7983f.png',
  'https://michigan-breakfast.s3.amazonaws.com/20a1a786-6829-4a71-a90e-886891f1ed80.png',
  'https://michigan-breakfast.s3.amazonaws.com/10ae174d-88b6-4729-9783-2d39ce57ef89.png',
  'https://michigan-breakfast.s3.amazonaws.com/0faeff5b-ce0f-49e0-a4d5-9d749a12a250.png',
  'https://michigan-breakfast.s3.amazonaws.com/19eda38a-c16c-4395-85a8-c2b64f13d9b2.png',
  'https://michigan-breakfast.s3.amazonaws.com/020fd81b-719e-490b-9dff-eaba52fa670d.png',
  'https://michigan-breakfast.s3.amazonaws.com/02f5fe68-039f-441b-acc9-7ee1d1d69aff.png',
  'https://michigan-breakfast.s3.amazonaws.com/03666191-807f-449e-9d3a-9e6f444e7aa1.png',
  'https://michigan-breakfast.s3.amazonaws.com/18885a49-fdb8-41df-ba67-7a726d742f4c.png',
  'https://michigan-breakfast.s3.amazonaws.com/1b73eff7-f9a4-4315-9c26-6192d1d14e40.png',
  'https://michigan-breakfast.s3.amazonaws.com/0571a66c-88bf-4454-9c80-f553fe76e128.png',
];

const LIST_IMAGES = [
  'https://michigan-breakfast.s3.amazonaws.com/00cd535e-b8a3-420f-a11f-a11be899d733.png',
  'https://michigan-breakfast.s3.amazonaws.com/078a42d6-ef83-472d-8018-012854880b1b.png',
  'https://michigan-breakfast.s3.amazonaws.com/1ca8c940-c5e0-4f94-a7af-5bb056e93621.png',
  'https://michigan-breakfast.s3.amazonaws.com/083fd446-791e-433f-8423-75aba9dc8adc.png',
  'https://michigan-breakfast.s3.amazonaws.com/245a6d71-df49-4f8d-8ec9-e87ca79abe8c.png',
  'https://michigan-breakfast.s3.amazonaws.com/1f1eaf93-0817-49ee-a1db-390d7940b08a.png',
  'https://michigan-breakfast.s3.amazonaws.com/25ca22ab-c5a6-4833-bb66-b7314e3385b2.png',
  'https://michigan-breakfast.s3.amazonaws.com/152c6bf5-550b-4f89-95c4-51f5aad97495.png',
  'https://michigan-breakfast.s3.amazonaws.com/1bc9cde4-3152-45e3-8068-9c699d0f4324.png',
  'https://michigan-breakfast.s3.amazonaws.com/1683fe63-2bdc-4895-af2a-1ad90978ed80.png',
  'https://michigan-breakfast.s3.amazonaws.com/1d00a216-fe0e-444b-ae28-65f3ecb1ed7d.png',
  'https://michigan-breakfast.s3.amazonaws.com/098b3a85-7172-4ac0-a4d8-985c2076f366.png',
  'https://michigan-breakfast.s3.amazonaws.com/11a1d15a-c1bb-43b5-85b8-2b311040d709.png',
  'https://michigan-breakfast.s3.amazonaws.com/035715fb-8fc8-4eae-9b01-67ca3e9d752f.png',
  'https://michigan-breakfast.s3.amazonaws.com/25a2da75-59d2-4c45-8e90-bb11b14581b5.png',
];

const BRANDING_IMAGES = [
  'https://michigan-breakfast.s3.amazonaws.com/1fa3900d-2ffa-47e7-8c0a-f1f1af839ca4.png',
  'https://michigan-breakfast.s3.amazonaws.com/057a744b-b1bf-4abb-9bed-fc1e38c03b97.png',
  'https://michigan-breakfast.s3.amazonaws.com/1795207b-8445-469c-8312-501e3f9b5a7d.png',
  'https://michigan-breakfast.s3.amazonaws.com/0c3e5b2e-ef30-428e-8403-e1b2165b2cae.png',
  'https://michigan-breakfast.s3.amazonaws.com/1958cf43-0630-4226-9a79-bf1b4b874b7a.png',
  'https://michigan-breakfast.s3.amazonaws.com/0b61cb36-239d-4c96-bb60-933ec8d877a8.png',
  'https://michigan-breakfast.s3.amazonaws.com/06b56858-557c-41b5-97a4-eef0225ee22e.png',
  'https://michigan-breakfast.s3.amazonaws.com/24e30e56-6558-416c-a7e9-f756f9a48f39.png',
  'https://michigan-breakfast.s3.amazonaws.com/1474629e-700e-4c30-85af-7878f62d3a70.png',
  'https://michigan-breakfast.s3.amazonaws.com/0b6e058f-2a6b-48b5-9b9f-e31ba17a3dcf.png',
  'https://michigan-breakfast.s3.amazonaws.com/0537fc42-48ac-46c5-bc27-42affa21b708.png',
  'https://michigan-breakfast.s3.amazonaws.com/084e8520-6aba-4b5c-81b4-c7faae6aa127.png',
  'https://michigan-breakfast.s3.amazonaws.com/228c1434-49e0-43a4-b95b-ff8626d8b93b.png',
  'https://michigan-breakfast.s3.amazonaws.com/28a09d1a-e551-4f79-b719-af5978ffddd3.png',
  'https://michigan-breakfast.s3.amazonaws.com/02739c5d-1430-404f-ba96-494e4a11a49f.png',
];

const INFO_IMAGES = [
  'https://michigan-breakfast.s3.amazonaws.com/184c2d9d-f167-4755-a4e9-f1cb6fde9e64.png',
  'https://michigan-breakfast.s3.amazonaws.com/24ebdb9e-c251-402e-9807-3a218f559a72.png',
  'https://michigan-breakfast.s3.amazonaws.com/19c820b7-7c71-4c40-a504-df715e5eb7c0.png',
  'https://michigan-breakfast.s3.amazonaws.com/0078860c-963e-4c37-a1b5-273b79d3f43e.png',
  'https://michigan-breakfast.s3.amazonaws.com/0a1e81db-07ea-4e8b-8f3f-28c59d6303ee.png',
  'https://michigan-breakfast.s3.amazonaws.com/227a50ef-d909-4493-a6d8-3122a3c6a5d7.png',
  'https://michigan-breakfast.s3.amazonaws.com/234f6207-842e-4bbb-8cf4-c8a5d9c55a6f.png',
  'https://michigan-breakfast.s3.amazonaws.com/299a7c11-f0c4-4ed1-9f98-89a9d56a216c.png',
  'https://michigan-breakfast.s3.amazonaws.com/065fff7b-ecd8-4fa2-86e1-48b893505f29.png',
  'https://michigan-breakfast.s3.amazonaws.com/19520df4-ce58-4183-94ac-f394a2e8ade3.png',
  'https://michigan-breakfast.s3.amazonaws.com/19e24df6-b57e-46fc-b1dc-f1d2a3bae372.png',
  'https://michigan-breakfast.s3.amazonaws.com/1179a136-a19d-44de-ba13-e0488124187e.png',
  'https://michigan-breakfast.s3.amazonaws.com/21a43f26-db05-4a51-b097-08a6843e9d89.png',
  'https://michigan-breakfast.s3.amazonaws.com/0659757e-7507-4229-b77a-ea0f946f1fbf.png',
  'https://michigan-breakfast.s3.amazonaws.com/261fa311-3242-47e9-a098-a37600a25a7e.png',
];

const init = () => {
  render(
    <Gallery
      scoreImages={SCORE_IMAGES}
      quoteImages={QUOTE_IMAGES}
      listImages={LIST_IMAGES}
      brandingImages={BRANDING_IMAGES}
      infoImages={INFO_IMAGES}
    />,
    document.getElementById('gallery')
  );
};

init();
