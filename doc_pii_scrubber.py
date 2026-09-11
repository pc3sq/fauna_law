import re
import spacy

# Load the lightweight, efficient open-source English NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise OSError("Please run: python -m spacy download en_core_web_sm")

def scrub_legal_pii(raw_text: str) -> str:
    """
    Processes a raw legal document, identifies PII using Named Entity Recognition (NER),
    and overwrites sensitive tokens with secure entity block tags.
    """
    # 1. Pre-process text using regex for standard formats like Social Security Numbers
    ssn_pattern = r'\b\d{3}-\d{2}-\d{4}\b'
    text_processed = re.sub(ssn_pattern, "[REDACTED_SSN]", raw_text)
    
    # 2. Pass the text through the open-source spaCy NLP pipeline
    doc = nlp(text_processed)
    
    # 3. Create a mutable list of tokens or characters to swap out entities
    # We loop through the detected entities in reverse to safely replace text without breaking character indices
    ents = list(doc.ents)
    text_list = list(text_processed)
    
    # Target entities relevant to legal privacy violations
    # PERSON: Client names, opposing counsel, judges
    # GPE: Cities, states, countries
    # ORG: Banks, corporations, private medical facilities
    # DATE: Specific occurrence dates that map to a docket
    # MONEY: Specific monetary damages or settlement numbers
    target_labels = {"PERSON", "GPE", "ORG", "DATE", "MONEY"}
    
    for ent in reversed(ents):
        if ent.label_ in target_labels:
            # Generate a secure database-compliant metadata tag block
            tag = f"[{ent.label_}]"
            # Overwrite the slice of text matching the sensitive entity
            text_list[ent.start_char:ent.end_char] = list(tag)
            
    # Re-join the character list back into a clean string
    scrubbed_text = "".join(text_list)
    
    # 4. Secondary regex cleanup to collapse sequential duplicate tags for better token utilization
    scrubbed_text = re.sub(r'(\[PERSON\]\s*)+', '[PERSON] ', scrubbed_text)
    
    return scrubbed_text


if __name__ == "__main__":
    # A simulation of a highly sensitive legal document containing privileged client details
    sample_legal_brief = (
        "Pursuant to Rule 56, plaintiff Johnathan Doe, residing at 742 Evergreen Terrace, "
        "hereby moves for Summary Judgment against Acme Corp. On October 14, 2024, "
        "the defendant breached the maritime shipping agreement, resulting in total liquid "
        "damages to the estate matching $450,000.00. The social security number on record "
        "for verification is 000-12-3456. Signed, Judge Raymond Cho."
    )
    
    print("--- RAW INGESTED FILE (PRIVILEGED) ---")
    print(sample_legal_brief)
    print("\nExecuting anonymization worker...")
    
    # Run the worker pipeline
    safe_output = scrub_legal_pii(sample_legal_brief)
    
    print("\n--- SANITIZED AGGREGATION LOOKUP FILE (SAFE FOR GLOBAL THEME ANALYSIS) ---")
    print(safe_output)