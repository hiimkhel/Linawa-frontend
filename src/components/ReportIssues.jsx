import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import MapComponent from './MapComponent';
import styles from "./ReportIssue.module.css";

const ReportIssues = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    } else {
      alert('You must be signed in to report an issue.');
    }
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !description || !selectedLocation || !userEmail) {
      alert('Please fill out all fields and select a location!');
      return;
    }

    const { lat, lng } = selectedLocation;

    const response = await fetch('https://linawa-backend-api.onrender.com/api/report-issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        description,
        location: { lat, lng },
        user_email: userEmail,
      }),
    });

    const data = await response.json();
    if (response.status === 201) {
      alert('Issue reported successfully!');
    } else {
      alert('Error reporting issue: ' + data.message);
    }

    setCategory('');
    setDescription('');
    setSelectedLocation(null);
  };

  return (
    <div className={styles.report-issue-container}>
      <div className={styles.form-container}>
        <div className={styles.map-container}>
          <MapComponent onLocationSelect={handleLocationSelect} />
        </div>
    
          <form onSubmit={handleSubmit} className={styles.report-issue-form}>
            <div className={styles.form-row}>
              <div className={styles.category-group}>
                <label htmlFor="category" className={styles.form-label}>Category:</label>
                <div className={styles.dropdown-container}>
                  <select
                    id="category"
                    className={styles.form-control}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Vote-Buying">Vote Buying</option>
                    <option value="Election-Fraud">Election Fraud</option>
                    <option value="Vote-Tampering">Vote Tampering</option>
                    <option value="Misinformation">Misinformation</option>
                    <option value="Polling-Station-Problem">Polling Station Problems</option>
                  </select>
                  <span className={styles.dropdown-icon}>▼</span>
                </div>
              </div>

              <div className={styles.description-group}>
                <label htmlFor="description" className={styles.form-label}>Description:</label>
                <textarea
                  id="description"
                  className={styles.form-control}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                />
              </div>
            </div>

            <button type="submit" className={styles.submit-button}>
              Submit Report
            </button>
          </form>
       
      </div>
    </div>
  );
};

export default ReportIssues;
