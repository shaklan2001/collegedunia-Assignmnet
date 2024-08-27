import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../src/App.css"; 
import { FaLongArrowAltRight, FaDownload } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const SortableTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [displayData, setDisplayData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const getFilteredAndSortedData = () => {
    const filtered = data.filter((college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const rankedData = [];
    const unrankedData = [];

    
    filtered.forEach((college) => {
      if (college.ranking) {

       
        rankedData[college.ranking - 1] = college;
      } else {
        unrankedData.push(college);
      }
    });

    
    const sorted = rankedData.concat(unrankedData);

  
    const cleanedSorted = sorted.filter((college) => college !== undefined);

  
    if (sortConfig !== null) {
      const start = rankedData.length;
      const end = sorted.length;

      cleanedSorted.slice(start, end).sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return cleanedSorted;
  };

    

  useEffect(() => {
    const filteredAndSortedData = getFilteredAndSortedData();
    const endIndex = currentPage * 10;
    const newDisplayData = filteredAndSortedData.slice(0, endIndex);

    setDisplayData(newDisplayData);
    setHasMore(filteredAndSortedData.length > endIndex);
  }, [data, sortConfig, searchQuery, currentPage]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset pagination on search
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 10 &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  const handleRowClick = (index) => {
    setSelectedRowIndex(index === selectedRowIndex ? null : index); 
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by College Name..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      {displayData.length === 0 && searchQuery ? (
        <div className="notFound">No colleges found.</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>College Name</th>
                  <th
                    onClick={() => handleSort("fees")}
                    className={`sortable ${
                      sortConfig?.key === "fees"
                        ? `sort-${sortConfig.direction}`
                        : ""
                    }`}
                  >
                    College Fees
                    <div className="dropdown">
                      <span className="arrow">&#9660;</span>
                      <div className="dropdown-content">
                        <button onClick={() => handleSort("fees")}>
                          Sort Ascending
                        </button>
                        <button onClick={() => handleSort("fees")}>
                          Sort Descending
                        </button>
                      </div>
                    </div>
                  </th>
                  <th>Placements</th>
                  <th
                    onClick={() => handleSort("userReview")}
                    className={`sortable ${
                      sortConfig?.key === "userReview"
                        ? `sort-${sortConfig.direction}`
                        : ""
                    }`}
                  >
                    User Reviews
                    <div className="dropdown">
                      <span className="arrow">&#9660;</span>
                      <div className="dropdown-content">
                        <button onClick={() => handleSort("userReview")}>
                          Sort Ascending
                        </button>
                        <button onClick={() => handleSort("userReview")}>
                          Sort Descending
                        </button>
                      </div>
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("collegeduniaRating")}
                    className={`sortable ${
                      sortConfig?.key === "collegeduniaRating"
                        ? `sort-${sortConfig.direction}`
                        : ""
                    }`}
                  >
                    Rating
                    <div className="dropdown">
                      <span className="arrow">&#9660;</span>
                      <div className="dropdown-content">
                        <button
                          onClick={() => handleSort("collegeduniaRating")}
                        >
                          Sort Ascending
                        </button>
                        <button
                          onClick={() => handleSort("collegeduniaRating")}
                        >
                          Sort Descending
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((college, index) => (
                  <tr
                    key={index}
                    className={`${college.featured ? "featured" : ""} ${
                      index === selectedRowIndex ? "selected-row" : ""
                    }`}
                    onClick={() => handleRowClick(index)}
                  >
                    <td>#{college.rank}</td>
                    <td>
                      <div className="college-info">
                        <img src={college.logo} className="college-logo" />
                        
                        <div>
                        {college.featured && (
                            <div className="featured-tag">Featured</div>
                          )}
                          <div className="college-name">{college.name}</div>
                          <div className="college-address">
                            {college.address}
                          </div>
                          <div className="college-actions">
                            <a href="#">
                              <FaLongArrowAltRight /> Apply Now
                            </a>
                            <a href="#">
                              <FaDownload /> Download Brochure
                            </a>
                            <a href="#">Add to Compare</a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fees-section">
                        ₹ {college.fees}
                        <div className="course-details">
                          {college.course}
                          <br />
                          {college.feeDetail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="placement-section">
                        ₹ {college.placement}
                        <div>Average Package</div>₹{college.highestPackage}
                        <div>Highest Package</div>
                      </div>
                    </td>
                    <td className="rating">
                      <GoDotFill /> {college.userReview} / 10
                      <br />
                      <div className="user-details">
                        Based on 239 User
                        <br />
                        Reviews
                      </div>
                    </td>
                    <td className="rating">{college.collegeduniaRating} / 10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!hasMore && <div>No more data available.</div>}
        </>
      )}
    </div>
  );
};

// Adding PropTypes validation
SortableTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      rank: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      fees: PropTypes.number.isRequired,
      course: PropTypes.string.isRequired,
      feeDetail: PropTypes.string.isRequired,
      placement: PropTypes.number.isRequired,
      highestPackage: PropTypes.number.isRequired,
      userReview: PropTypes.string.isRequired,
      collegeduniaRating: PropTypes.number.isRequired,
      logo: PropTypes.string.isRequired,
      featured: PropTypes.bool,
    })
  ).isRequired,
};

export default SortableTable;
