import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const schemaTemplates = {
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "",
    "url": "",
    "logo": "",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "support"
    }
  },
  WebPage: {
    "@context": "https://schema.org/",
    "@type": "WebPage",
    "@id": "",
    "name": "",
    "url": "",
    "description": "",
    "disambiguatingDescription": "",
    "publisher": {
      "@id": ""
    },
    "author": {
      "@id": ""
    },
    "copyrightHolder": {
      "@id": ""
    },
    "about": [],
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "@id": "",
      "inLanguage": "",
      "url": "",
      "contentUrl": "",
      "width": "",
      "height": ""
    },
    "inLanguage": "",
    "isPartOf": {
      "@type": "website",
      "@id": ""
    }
  },
  FAQPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{  // Array of Questions
      "@type": "Question",
      "name": "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": ""
      }
    }]
  },
  Person: {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "",
    "url": "",
    "jobTitle": "",
    "worksFor": {
      "@type": "Organization",
      "name": ""
    },
    "@id": "", // Newly added
    "description": "", // Newly added
    "sameAs": [], // Newly added
    "image": { // Newly added
      "@type": "ImageObject",
      "@id": "",
      "url": "",
      "caption": ""
    },
    "mainEntityOfPage": { // Newly added
      "@type": "ProfilePage",
      "@id": "",
      "url": "",
      "name": "",
      "inLanguage": "",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "",
        "url": "",
        "name": "",
        "publisher": {
          "@type": "Organization",
          "@id": "",
          "name": "",
          "url": "",
          "email": "",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressLocality": "",
            "addressRegion": "",
            "postalCode": "",
            "addressCountry": {
              "@type": "Country",
              "name": ""
            }
          },
          "logo": {
            "@type": "ImageObject",
            "@id": "",
            "url": "",
            "contentUrl": "",
            "caption": "",
            "width": "",
            "height": ""
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "",
            "contactType": ""
          }
        }
      }
    }
  },
  LocalBusiness: {
    "@context": "https://schema.org/",
    "@type": "LocalBusiness",
    "@id": "",
    "name": "",
    "legalName": "",
    "additionalType": [],
    "description": "",
    "url": "",
    "mainEntityOfPage": "",
    "sameAs": [],
    "currenciesAccepted": "",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [],
      "opens": "",
      "closes": ""
    },
    "paymentAccepted": [],
    "priceRange": "",
    "logo": {
      "@type": "ImageObject",
      "@id": "",
      "url": "",
      "width": "",
      "height": ""
    },
    "image": {
      "@id": ""
    },
    "location": {
      "@type": "PostalAddress",
      "@id": "",
      "name": "",
      "streetAddress": "",
      "addressLocality": "",
      "addressRegion": "",
      "addressCountry": "",
      "postalCode": ""
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "",
      "longitude": ""
    },
    "address": {
      "@id": ""
    },
    "hasMap": [],
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "",
      "@id": "",
      "url": "",
      "hasMap": ""
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "",
      "telephone": "",
      "areaServed": {
        "@id": ""
      }
    },
    "telephone": "",
    "employees": {
      "@type": "Person",
      "name": "",
      "url": [],
      "image": "",
      "jobTitle": {
        "@type": "DefinedTerm",
        "name": "",
        "description": "",
        "url": ""
      }
    },
    "founder": {
      "@type": "Person",
      "alternateName": [],
      "sameAs": [],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "",
        "addressRegion": ""
      },
      "knowsAbout": [],
      "url": "",
      "mainEntityOfPage": "",
      "@id": "",
      "familyName": "",
      "givenName": "",
      "name": "",
      "height": "",
      "description": "",
      "jobTitle": {
        "@type": "DefinedTerm",
        "name": "",
        "description": "",
        "url": ""
      },
      "gender": "",
      "email": "",
      "image": "",
      "birthDate": "",
      "worksFor": {
        "@type": "Organization",
        "@id": ""
      },
      "nationality": {
        "@type": "Country",
        "@id": "",
        "url": "",
        "name": "",
        "sameAs": "",
        "logo": "",
        "hasMap": ""
      },
      "alumniOf": []
    },
    "foundingDate": "",
    "foundingLocation": {
      "@type": "Place",
      "@id": "",
      "name": "",
      "URL": "",
      "hasMap": ""
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "itemListElement": []
    },
    "interactionStatistic": "",
    "knowsLanguage": [],
    "numberOfEmployees": "",
    "taxID": ""
  },
};

const SchemaGenerator = () => {
  const [selectedType, setSelectedType] = useState('Organization');
  const [schema, setSchema] = useState(schemaTemplates[selectedType]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setSchema({ ...schemaTemplates[type] });
  };

  const handleInputChange = (path, value) => {
    const schemaCopy = { ...schema };
    let current = schemaCopy;
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] === undefined) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setSchema(schemaCopy);
  };

  const handleSubmit = () => {
    console.log(JSON.stringify(schema, null, 2));
  };
  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Success message or logic
        alert('Copied to clipboard!');
      })
      .catch(err => {
        // Error handling
        console.error('Failed to copy text to clipboard', err);
      });
  };
  const addNewQuestion = () => {
    const newQuestion = {
      "@type": "Question",
      "name": "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": ""
      }
    };
    setSchema({
      ...schema,
      mainEntity: [...schema.mainEntity, newQuestion]
    });
  };
  const renderInput = (label, path, type = 'text') => {
    // Retrieve the value from the schema using the path
    let value = path.reduce((acc, key) => acc[key] || '', schema);
  
    // Check if the value should be an array type
    if (type === 'array') {
      // Ensure the value is an array; if not, convert it into an array
      value = Array.isArray(value) ? value : (value ? [value] : []);
  
      // Render a textarea for array values
      return (
        <div className="mb-4" key={label}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {label}
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={value.join('\n')} // Now it's safe to call join
            onChange={(e) => handleInputChange(path, e.target.value.split('\n'))}
          />
        </div>
      );
    }
  
    // For non-array types, render a regular input
    return (
      <div className="mb-4" key={label}>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={value}
          onChange={(e) => handleInputChange(path, e.target.value)}
        />
      </div>
    );
  };

  const renderSchemaInputs = () => {
    switch (selectedType) {
      case 'Organization':
        return (
          <>
            {renderInput('URL', ['url'])}
            {renderInput('Same As', ['sameAs'], 'array')} // Assuming you handle array inputs
            {renderInput('Logo URL', ['logo'])}
            {renderInput('Name', ['name'])}
            {renderInput('Alternate Name', ['alternateName'])}
            {renderInput('Legal Name', ['legalName'])}
            {renderInput('Description', ['description'])}
            {renderInput('Street Address', ['address', 'streetAddress'])}
            {renderInput('Locality', ['address', 'addressLocality'])}
            {renderInput('Country', ['address', 'addressCountry'])}
            {renderInput('Region', ['address', 'addressRegion'])}
            {renderInput('Postal Code', ['address', 'postalCode'])}
            {renderInput('VAT ID', ['vatID'])}
            {renderInput('Email', ['contactPoint', 'email'])}
            {renderInput('Telephone', ['contactPoint', 'telephone'])}
            {renderInput('Contact Type', ['contactPoint', 'contactType'])}
            {renderInput('Contact Option', ['contactPoint', 'contactOption'])}
            {renderInput('Area Served', ['contactPoint', 'areaServed'])}
            {renderInput('Available Language', ['contactPoint', 'availableLanguage'])}
          </>
        );
        case 'FAQPage':
        return (
          <div>
            {schema.mainEntity.map((question, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold">Question {index + 1}</h3>
                {renderInput(`Question ${index + 1} Name`, ['mainEntity', index, 'name'])}
                {renderInput(`Question ${index + 1} Answer`, ['mainEntity', index, 'acceptedAnswer', 'text'], 'textarea')}
              </div>
            ))}
            <div style={{display:"flex", justifyContent:"center"}}>

            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={addNewQuestion}
            >
              Add New Question
            </button>
            </div>
          </div>
        );
        case 'Person':
          return (
            <>
             {renderInput('Person ID', ['@id'])}
          {renderInput('Name', ['name'])}
          {renderInput('URL', ['url'])}
          {renderInput('Job Title', ['jobTitle'])}
          {renderInput('Description', ['description'])}
          {renderInput('Same As', ['sameAs'], 'array')}
          {renderInput('Image Object ID', ['image', '@id'])}
          {renderInput('Image URL', ['image', 'url'])}
          {renderInput('Image Caption', ['image', 'caption'])}
          {renderInput('Works For - Organization ID', ['worksFor', '@id'])}
          {renderInput('Works For - Organization Name', ['worksFor', 'name'])}
          {renderInput('Works For - URL', ['worksFor', 'url'])}
          {renderInput('Works For - Email', ['worksFor', 'email'])}
          {renderInput('Works For - Street Address', ['worksFor', 'address', 'streetAddress'])}
          {renderInput('Works For - Locality', ['worksFor', 'address', 'addressLocality'])}
          {renderInput('Works For - Region', ['worksFor', 'address', 'addressRegion'])}
          {renderInput('Works For - Postal Code', ['worksFor', 'address', 'postalCode'])}
          {renderInput('Works For - Country', ['worksFor', 'address', 'addressCountry', 'name'])}
          {renderInput('Works For - Logo ID', ['worksFor', 'logo', '@id'])}
          {renderInput('Works For - Logo URL', ['worksFor', 'logo', 'url'])}
          {renderInput('Works For - Logo Content URL', ['worksFor', 'logo', 'contentUrl'])}
          {renderInput('Works For - Logo Caption', ['worksFor', 'logo', 'caption'])}
          {renderInput('Works For - Logo Width', ['worksFor', 'logo', 'width'])}
          {renderInput('Works For - Logo Height', ['worksFor', 'logo', 'height'])}
          {renderInput('Works For - Telephone', ['worksFor', 'contactPoint', 'telephone'])}
          {renderInput('Works For - Contact Type', ['worksFor', 'contactPoint', 'contactType'])}
          {renderInput('Main Entity Of Page - ID', ['mainEntityOfPage', '@id'])}
          {renderInput('Main Entity Of Page - URL', ['mainEntityOfPage', 'url'])}
          {renderInput('Main Entity Of Page - Name', ['mainEntityOfPage', 'name'])}
          {renderInput('Main Entity Of Page - Language', ['mainEntityOfPage', 'inLanguage'])}
          {renderInput('Main Entity Of Page - Is Part Of - ID', ['mainEntityOfPage', 'isPartOf', '@id'])}
          {renderInput('Main Entity Of Page - Is Part Of - URL', ['mainEntityOfPage', 'isPartOf', 'url'])}
          {renderInput('Main Entity Of Page - Is Part Of - Name', ['mainEntityOfPage', 'isPartOf', 'name'])}
          {renderInput('Main Entity Of Page - Is Part Of - Publisher - ID', ['mainEntityOfPage', 'isPartOf', 'publisher', '@id'])}
          {renderInput('Main Entity Of Page - Is Part Of - Publisher - Name', ['mainEntityOfPage', 'isPartOf', 'publisher', 'name'])}
          {renderInput('Main Entity Of Page - Is Part Of - Publisher - URL', ['mainEntityOfPage', 'isPartOf', 'publisher', 'url'])}
          {renderInput('Main Entity Of Page - Is Part Of - Publisher - Email', ['mainEntityOfPage', 'isPartOf', 'publisher', 'email'])}
            </>
          );
        case 'LocalBusiness':
          return (
            <>
              {/* Các trường nhập liệu cơ bản của LocalBusiness */}
              {renderInput('Local Business ID', ['@id'])}
              {renderInput('Name', ['name'])}
              {renderInput('Legal Name', ['legalName'])}
              {renderInput('Description', ['description'])}
              {renderInput('URL', ['url'])}
              {renderInput('Main Entity Of Page', ['mainEntityOfPage'])}
              {renderInput('Currencies Accepted', ['currenciesAccepted'])}
              {renderInput('Price Range', ['priceRange'])}
              {renderInput('Telephone', ['telephone'])}
              {renderInput('Number Of Employees', ['numberOfEmployees'])}
              {renderInput('Tax ID', ['taxID'])}
              {renderInput('Opening Hours', ['openingHoursSpecification', 'opens'])}
              {renderInput('Closing Hours', ['openingHoursSpecification', 'closes'])}
              {renderInput('Days Of Week', ['openingHoursSpecification', 'dayOfWeek'], 'array')}
              {renderInput('Payment Accepted', ['paymentAccepted'], 'array')}
              {renderInput('Same As', ['sameAs'], 'array')}
              {renderInput('Knows Language', ['knowsLanguage'], 'array')}
              
              {/* Trường nhập liệu cho 'Logo' */}
              <h3 className="text-lg font-bold">Logo</h3>
              {renderInput('Logo ID', ['logo', '@id'])}
              {renderInput('Logo URL', ['logo', 'url'])}
              {renderInput('Logo Width', ['logo', 'width'])}
              {renderInput('Logo Height', ['logo', 'height'])}
    
              {/* Trường nhập liệu cho 'Location' */}
              <h3 className="text-lg font-bold">Location</h3>
              {renderInput('Location ID', ['location', '@id'])}
              {renderInput('Location Name', ['location', 'name'])}
              {renderInput('Street Address', ['location', 'streetAddress'])}
              {renderInput('Address Locality', ['location', 'addressLocality'])}
              {renderInput('Address Region', ['location', 'addressRegion'])}
              {renderInput('Postal Code', ['location', 'postalCode'])}
              {renderInput('Address Country', ['location', 'addressCountry'])}
    
              {/* Trường nhập liệu cho 'Geo' */}
              <h3 className="text-lg font-bold">Geo Coordinates</h3>
              {renderInput('Latitude', ['geo', 'latitude'])}
              {renderInput('Longitude', ['geo', 'longitude'])}
    
              {/* Trường nhập liệu cho 'Founder' */}
              <div className="mb-4">
            <h3 className="text-lg font-bold">Founder</h3>
            {renderInput('Founder ID', ['founder', '@id'])}
            {renderInput('Founder Name', ['founder', 'name'])}
            {renderInput('Founder Family Name', ['founder', 'familyName'])}
            {renderInput('Founder Given Name', ['founder', 'givenName'])}
            {renderInput('Founder Alternate Names', ['founder', 'alternateName'], 'array')}
            {renderInput('Founder Same As', ['founder', 'sameAs'], 'array')}
            {renderInput('Founder URL', ['founder', 'url'])}
            {renderInput('Founder Main Entity Of Page', ['founder', 'mainEntityOfPage'])}
            {renderInput('Founder Description', ['founder', 'description'])}
            {renderInput('Founder Job Title', ['founder', 'jobTitle', 'name'])}
            {renderInput('Founder Job Description', ['founder', 'jobTitle', 'description'])}
            {renderInput('Founder Email', ['founder', 'email'])}
            {renderInput('Founder Gender', ['founder', 'gender'])}
            
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
            itemListElement (Nhập ID, Name, và URL cho mỗi dịch vụ, cách nhau bởi dấu phẩy)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={schema.hasOfferCatalog.itemListElement.map(item => `${item.item['@id']}, ${item.item.name}, ${item.item.url}`).join('\n')}
              onChange={(e) => {
                const newItemListElement = e.target.value.split('\n').map(line => {
                  const parts = line.split(',').map(part => part.trim());
                  return {
                    "@type": "ListItem",
                    "item": {
                      "@type": "service",
                      "@id": parts[0],
                      "name": parts[1],
                      "url": parts[2]
                    }
                  };
                });
                handleInputChange(['hasOfferCatalog', 'itemListElement'], newItemListElement);
              }}
            />
          </div>
            </>
          );
        case 'WebPage':
          return (
            <>
              {renderInput('ID', ['@id'])}
              {renderInput('Name', ['name'])}
              {renderInput('URL', ['url'])}
              {renderInput('Description', ['description'])}
              {renderInput('Disambiguating Description', ['disambiguatingDescription'])}
              {renderInput('Publisher ID', ['publisher', '@id'])}
              {renderInput('Author ID', ['author', '@id'])}
              {renderInput('Copyright Holder ID', ['copyrightHolder', '@id'])}
              {renderInput('Language of Page', ['inLanguage'])}
              <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              About (Nhập ID, Name, và URL cho mỗi mục, cách nhau bởi dấu phẩy)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={schema.about.map(item => `${item['@id']}, ${item.name}, ${item.url}`).join('\n')}
              onChange={(e) => {
                const newAbout = e.target.value.split('\n').map(line => {
                  const parts = line.split(',').map(part => part.trim());
                  return { '@id': parts[0], 'name': parts[1], 'url': parts[2] };
                });
                handleInputChange(['about'], newAbout);
              }}
            />
          </div>
              {renderInput('Image Object ID', ['primaryImageOfPage', '@id'])}
              {renderInput('Image URL', ['primaryImageOfPage', 'url'])}
              {renderInput('Content URL', ['primaryImageOfPage', 'contentUrl'])}
              {renderInput('Image Width', ['primaryImageOfPage', 'width'])}
              {renderInput('Image Height', ['primaryImageOfPage', 'height'])}
              {renderInput('Is Part Of', ['isPartOf', '@id'])}
            </>
          );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full min-h-screen">
    {/* Form Section */}
    <div className="flex-1 p-8">
      {/* Form heading */}
    

      <Link className='btn' to={'/schema'}>Thoát</Link>
      <h2 className="text-2xl font-bold mb-6">Schema Generator</h2>
      
      {/* Dropdown for selecting type */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Schema @type
        </label>
        <select
          className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={selectedType}
          onChange={handleTypeChange}
        >
          {Object.keys(schemaTemplates).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      {/* Dynamically rendered inputs */}
      {renderSchemaInputs()}
      
      {/* Submit Button */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSubmit}
      >
        Generate Schema
      </button>
    </div>
  
    {/* JSON Output Section */}
    <div className="sticky top-0 max-h-screen overflow-auto w-1/2">
      <div style={{display:"flex"}}>

    <h2 className="text-xl font-semibold mb-4">JSON-LD Output</h2>
    <button
  className="btn" style={{marginLeft:"10px"}}
  onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}
>
  Copy JSON
</button>
<button
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  onClick={() => downloadJson(schema, 'schema.json')}
>
  Download JSON
</button>

      </div>
    <pre className="p-4 bg-gray-100 rounded-lg shadow-inner">
      {JSON.stringify(schema, null, 2)}
    </pre>
  </div>
  </div>  
  );
};

export default SchemaGenerator;
